const express = require("express");
const db = require("../config/db");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// ----- MIDDLEWARE (GURU) -----
const isGuru = (req, res, next) => {
  if (req.user && req.user.role === "guru") {
    next();
  } else {
    return res.status(403).json({
      status: "error",
      message: "Akses ditolak: Fitur ini hanya bisa digunakan oleh guru.",
    });
  }
};

router.use(verifyToken);
router.use(isGuru);

// ----- Jdawal kesediaan Guru -----
router.post("/kesediaan", async (req, res) => {
  // extract payload dari frontend
  const { tanggal_awal, tanggal_akhir, jadwal_harian } = req.body;

  const id_guru = req.user.id_user;

  if (
    !tanggal_awal ||
    !tanggal_akhir ||
    !jadwal_harian ||
    !Array.isArray(jadwal_harian)
  ) {
    return res.status(400).json({ message: "Lengkapi data yang diperlukan!" });
  }
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // insert ke table jadwal_kesediaan
    const insertKesediaan = `
            INSERT INTO jadwal_kesediaan (id_guru, tanggal_awal_bersedia, tanggal_akhir_bersedia) 
            VALUES (?, ?, ?)
        `;
    const [kesediaanResult] = await connection.query(insertKesediaan, [
      id_guru,
      tanggal_awal,
      tanggal_akhir,
    ]);
    const id_kesediaan = kesediaanResult.insertId;

    // buat array jadwalData untuk handle masalah ketika dalam 1 hari terdapat 2 kesediaan yang dipisahkan waktu istirahat misalnya
    const jadwalData = [];
    for (const hariItem of jadwal_harian) {
      const { hari, slots } = hariItem;

      if (slots && Array.isArray(slots)) {
        for (const slot of slots) {
          // push tiap data ke array
          jadwalData.push([
            id_kesediaan,
            hari,
            slot.jam_mulai,
            slot.jam_selesai,
          ]);
        }
      }
    }

    // bulk insert ke table jadwal
    if (jadwalData.length > 0) {
      await connection.rollback();
      const insertJadwal = `INSERT INTO jadwal (id_kesediaan, hari_mengajar, jam_mulai, jam_selesai) VALUES ?`;
      await connection.query(insertJadwal, [jadwalData]);
    }

    await connection.commit();

    const [rows] = await connection.query(
      `SELECT 
  jk.id_kesediaan,
  jk.tanggal_awal_bersedia AS tanggal_awal,
  jk.tanggal_akhir_bersedia AS tanggal_akhir,
  j.hari_mengajar,
  j.jam_mulai,
  j.jam_selesai
FROM jadwal_kesediaan jk
JOIN jadwal j ON jk.id_kesediaan = j.id_kesediaan
WHERE jk.id_kesediaan = ?;
`,
      [id_kesediaan],
    );

    const formattedData = {
      tanggal_awal: rows[0].tanggal_awal,
      tanggal_akhir: rows[0].tanggal_akhir,
      jadwal_harian: [],
    };

    rows.forEach((row) => {
      let hari = formattedData.jadwal_harian.find(
        (h) => h.hari === row.hari_mengajar,
      );
      if (!hari) {
        hari = { hari: row.hari_mengajar, slots: [] };
        formattedData.jadwal_harian.push(hari);
      }
      hari.slots.push({
        jam_mulai: row.jam_mulai,
        jam_selesai: row.jam_selesai,
      });
    });

    res.status(201).json({
      status: "success",
      message: "Jadwal berhasil disimpan dan dipublikasikan",
      data: formattedData,
    });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  } finally {
    connection.release();
  }
});

// ----- Get Kalender -----

router.get("/kalender", async (req, res) => {
  const { start_date, end_date } = req.query;
  const id_guru = req.user.id_user;

  if (!start_date || !end_date) {
    return res.status(400).json({
      status: "error",
      message: "Parameter start_date dan end_date (YYYY-MM-DD) wajib diisi!",
    });
  }

  try {
    // query untuk mengambil data sesi yang aktif dan yang ada di dalam rentang
    const getKalender = `
            SELECT 
                pi.id_penditem,
                j.hari_mengajar,
                pi.jam_mulai_les,
                pi.jam_selesai_les,
                mp.nama AS nama_mapel,
                u.nama AS nama_murid,
                pi.status,
                pi.catatan
            FROM pendaftaran_item pi
            JOIN jadwal j ON pi.id_jadwal = j.id_jadwal
            JOIN jadwal_kesediaan jk ON j.id_kesediaan = jk.id_kesediaan
            JOIN mata_pelajaran mp ON pi.id_mapel = mp.id_mapel
            JOIN pendaftaran p ON pi.id_daftar = p.id_daftar
            JOIN user u ON p.id_murid = u.id_user
            WHERE jk.id_guru = ?
              AND pi.tanggal_mulai <= ? 
              AND pi.tanggal_selesai >= ?
            ORDER BY FIELD(j.hari_mengajar, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'), 
                     pi.jam_mulai_les ASC
    `;

    const [jadwalAktif] = await db.query(getKalender, [
      id_guru,
      start_date,
      end_date,
    ]);

    // kelompokkan berdasarkan hari
    const formattedData = jadwalAktif.reduce((acc, curr) => {
      const hari = curr.hari_mengajar;
      if (!acc[hari]) {
        acc[hari] = [];
      }
      acc[hari].push({
        id_penditem: curr.id_penditem,
        mapel: curr.nama_mapel,
        murid: curr.nama_murid,
        jam_mulai: curr.jam_mulai_les.substring(0, 5), // HH:MM
        jam_selesai: curr.jam_selesai_les.substring(0, 5), // HH:MM
        status: curr.status,
        catatan: curr.catatan,
      });
      return acc;
    }, {});

    res.status(200).json({
      status: "success",
      message: "Data kalender berhasil diambil",
      data: formattedData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/murid-aktif", async (req, res) => {
  const id_guru = req.user.id_user;

  try {
    const getMuridAktif = `
            SELECT 
                u.id_user AS id_murid,
                u.nama AS nama_murid,
                tp.jenjang,
                tp.tingkat,
                mp.nama AS nama_mapel,
                COUNT(pi.id_penditem) AS total_sesi,
                SUM(CASE WHEN pi.status = 'Selesai' THEN 1 ELSE 0 END) AS sesi_selesai,
                MAX(pi.tanggal_selesai) AS aktif_hingga
            FROM pendaftaran_item pi
            JOIN pendaftaran p ON pi.id_daftar = p.id_daftar
            JOIN user u ON p.id_murid = u.id_user
            JOIN murid m ON u.id_user = m.id_murid
            LEFT JOIN tingkat_pendidikan tp ON m.id_pendidikan = tp.id_pendidikan
            JOIN mata_pelajaran mp ON pi.id_mapel = mp.id_mapel
            JOIN jadwal j ON pi.id_jadwal = j.id_jadwal
            JOIN jadwal_kesediaan jk ON j.id_kesediaan = jk.id_kesediaan
            WHERE jk.id_guru = ?
            GROUP BY u.id_user, mp.id_mapel
            ORDER BY aktif_hingga DESC
        `;

    const [muridAktif] = await db.query(getMuridAktif, [id_guru]);

    res.status(200).json({
      status: "success",
      data: muridAktif,
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/riwayat-sesi", async (req, res) => {
  const id_guru = req.user.id_user;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const offset = (page - 1) * limit;

  try {
    // query untuk menghitung banyak murid yang udah diajar
    const countMurid = `
            SELECT COUNT(*) AS total_items
            FROM pendaftaran_item pi
            JOIN pendaftaran p ON pi.id_daftar = p.id_daftar
            JOIN user u ON p.id_murid = u.id_user
            JOIN mata_pelajaran mp ON pi.id_mapel = mp.id_mapel
            JOIN jadwal j ON pi.id_jadwal = j.id_jadwal
            JOIN jadwal_kesediaan jk ON j.id_kesediaan = jk.id_kesediaan
            WHERE jk.id_guru = ?
        `;
    const countParams = [id_guru];

    // query untuk mengambil data murid yang les
    let dataQuery = `
            SELECT 
                pi.id_penditem,
                pi.tanggal_mulai AS tanggal_sesi,
                j.hari_mengajar,
                pi.jam_mulai_les,
                pi.jam_selesai_les,
                u.nama AS nama_murid,
                mp.nama AS nama_mapel,
                pi.status,
                pi.catatan
            FROM pendaftaran_item pi
            JOIN pendaftaran p ON pi.id_daftar = p.id_daftar
            JOIN user u ON p.id_murid = u.id_user
            JOIN mata_pelajaran mp ON pi.id_mapel = mp.id_mapel
            JOIN jadwal j ON pi.id_jadwal = j.id_jadwal
            JOIN jadwal_kesediaan jk ON j.id_kesediaan = jk.id_kesediaan
            WHERE jk.id_guru = ?
        `;
    const dataParams = [id_guru];

    // handle pencarian berdasarkan nama murid atau mata pelajaran
    if (search) {
      const searchPattern = `%${search}%`;
      const searchSql = ` AND (u.nama LIKE ? OR mp.nama LIKE ?)`;

      countMurid += searchSql;
      countParams.push(searchPattern, searchPattern);

      dataQuery += searchSql;
      dataParams.push(searchPattern, searchPattern);
    }

    // sorting dan pagination
    dataQuery += ` ORDER BY pi.tanggal_mulai DESC, pi.jam_mulai_les DESC LIMIT ? OFFSET ?`;
    dataParams.push(limit, offset);

    const [countResult] = await db.query(countMurid, countParams);
    const [dataResult] = await db.query(dataQuery, dataParams);

    const totalItems = countResult[0].total_items;

    res.status(200).json({
      status: "success",
      pagination: {
        total_items: totalItems,
        total_pages: Math.ceil(totalItems / limit),
        current_page: page,
        limit: limit,
      },
      data: dataResult,
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/dashboard", async (req, res) => {
  const id_guru = req.user.id_user;

  try {
    // query untuk mengambil lama waktu mengajar
    const sqlStats = `
            SELECT 
                COALESCE(SUM(CASE WHEN pi.status = 'Selesai' THEN TIMESTAMPDIFF(MINUTE, pi.jam_mulai_les, pi.jam_selesai_les) ELSE 0 END) / 60, 0) AS total_jam_mengajar,
                COUNT(DISTINCT p.id_murid) AS jumlah_murid_aktif,
                COUNT(CASE WHEN pi.status = 'Mendatang' THEN 1 END) AS total_sesi_aktif
            FROM pendaftaran_item pi
            JOIN pendaftaran p ON pi.id_daftar = p.id_daftar
            JOIN jadwal j ON pi.id_jadwal = j.id_jadwal
            JOIN jadwal_kesediaan jk ON j.id_kesediaan = jk.id_kesediaan
            WHERE jk.id_guru = ?
        `;

    // query untuk mengambil jadwal yang ada di rentang seminggu
    const sqlJadwalTerdekat = `
            SELECT 
                pi.id_penditem,
                pi.tanggal_mulai AS tanggal_sesi,
                pi.jam_mulai_les,
                pi.jam_selesai_les,
                u.nama AS nama_murid,
                tp.tingkat,
                tp.jenjang,
                mp.nama AS nama_mapel,
                pi.status
            FROM pendaftaran_item pi
            JOIN pendaftaran p ON pi.id_daftar = p.id_daftar
            JOIN user u ON p.id_murid = u.id_user
            JOIN murid m ON u.id_user = m.id_murid
            LEFT JOIN tingkat_pendidikan tp ON m.id_pendidikan = tp.id_pendidikan
            JOIN mata_pelajaran mp ON pi.id_mapel = mp.id_mapel
            JOIN jadwal j ON pi.id_jadwal = j.id_jadwal
            JOIN jadwal_kesediaan jk ON j.id_kesediaan = jk.id_kesediaan
            WHERE jk.id_guru = ? 
              AND pi.tanggal_mulai >= CURDATE()
            ORDER BY pi.tanggal_mulai ASC, pi.jam_mulai_les ASC
            LIMIT 3
        `;

    // query untuk mengambil req kelas yang baru aja dibuat
    const sqlPermintaanKelas = `
            SELECT 
                pi.id_penditem,
                pi.tanggal_mulai AS tanggal_sesi,
                pi.jam_mulai_les,
                u.nama AS nama_murid,
                tp.tingkat,
                tp.jenjang,
                mp.nama AS nama_mapel
            FROM pendaftaran_item pi
            JOIN pendaftaran p ON pi.id_daftar = p.id_daftar
            JOIN user u ON p.id_murid = u.id_user
            JOIN murid m ON u.id_user = m.id_murid
            LEFT JOIN tingkat_pendidikan tp ON m.id_pendidikan = tp.id_pendidikan
            JOIN mata_pelajaran mp ON pi.id_mapel = mp.id_mapel
            JOIN jadwal j ON pi.id_jadwal = j.id_jadwal
            JOIN jadwal_kesediaan jk ON j.id_kesediaan = jk.id_kesediaan
            WHERE jk.id_guru = ? 
              AND pi.status = 'Mendatang'
              AND pi.tanggal_mulai >= CURDATE()
            ORDER BY pi.id_penditem DESC
            LIMIT 2
        `;

    // query yang perlu dieksekusi terdapat 3 query sehingga menggunakan Promies.all untuk memudahkan menjalankan query nya
    const [[statsResult], [jadwalResult], [permintaanResult]] =
      await Promise.all([
        db.query(sqlStats, [id_guru]),
        db.query(sqlJadwalTerdekat, [id_guru]),
        db.query(sqlPermintaanKelas, [id_guru]),
      ]);

    // menyusun response sesuai yang diminta dashboard page
    const dashboardData = {
      statistik: {
        total_jam_mengajar: parseFloat(
          statsResult[0].total_jam_mengajar,
        ).toFixed(1),
        jumlah_murid_aktif: statsResult[0].jumlah_murid_aktif,
        total_sesi_aktif: statsResult[0].total_sesi_aktif,
      },
      jadwal_minggu_ini: jadwalResult.map((item) => ({
        id_penditem: item.id_penditem,
        tanggal: item.tanggal_sesi,
        waktu: `${item.jam_mulai_les.substring(0, 5)} - ${item.jam_selesai_les.substring(0, 5)}`,
        mapel: item.nama_mapel,
        murid: item.nama_murid,
        deskripsi_kelas: `Kelas ${item.tingkat} ${item.jenjang}`,
        status: item.status,
      })),
      permintaan_kelas: permintaanResult.map((item) => ({
        id_penditem: item.id_penditem,
        tanggal: item.tanggal_sesi,
        waktu: `${item.jam_mulai_les.substring(0, 5)} WIB`,
        murid: item.nama_murid,
        deskripsi: `${item.nama_mapel} • ${item.jenjang} Kelas ${item.tingkat}`,
      })),
    };

    res.status(200).json({
      status: "success",
      data: dashboardData,
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;
