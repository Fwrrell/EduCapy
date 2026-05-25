import { GraduationCap, Timer, CalendarClock, BookOpen } from "lucide-react";
export default function MainPages() {
  return (
    <>
      <div className="flex flex-col gap-10 p-10 w-full ">
        {/* card 1 welcome */}
        <div className="flex justify-between items-center bg-white rounded-2xl shadow-md p-10">
          <div className="">
            <h1 className="text-[3.5rem] font-bold">
              Selamat Datang, {`Budi`}!
            </h1>
            <p className="text-[1.5rem] font-normal">
              Mau belajar apa hari ini?
            </p>
          </div>
          <div className="">
            <button className="rounded-xl bg-[#406749] p-5 flex items-center gap-3 text-white capitalize font-bold cursor-pointer">
              <GraduationCap className="w-6 h-6 " />
              <span>daftar kelas baru</span>
            </button>
          </div>
        </div>
        {/* card 2 statistic */}
        <div className="flex gap-6 w-full justify-between items-center">
          {/* total hours */}
          <div className="rounded-2xl shadow-md flex-1 flex items-center p-8 gap-6 bg-white min-w-max">
            <div className="rounded-full p-3 bg-[#8FB996] shrink-0">
              <Timer className="w-8 h-8" color="#244A2F" />
            </div>
            <div className="flex flex-col ">
              <h4 className="uppercase font-semibold text-md tracking-wider whitespace-nowrap text-[#424942]">
                total jam belajar
              </h4>
              <p className="flex items-baseline gap-2">
                <span className="font-extrabold text-3xl text-slate-800">
                  42.5
                </span>
                <span className="font-medium text-lg text-slate-500">jam</span>
              </p>
            </div>
          </div>
          <div className="rounded-2xl shadow-md flex flex-1 items-center p-8 gap-6 bg-white min-w-max">
            <div className="rounded-full p-3 bg-[#FEBF89] shrink-0">
              <CalendarClock className="w-12 h-12" color="#794C20" />
            </div>
            <div className="flex flex-col">
              <h4 className="uppercase font-semibold text-md text-[#424942] tracking-wider whitespace-nowrap">
                sesi mendatang
              </h4>
              <p className="flex items-baseline gap-2">
                <span className="font-extrabold text-3xl text-slate-800">
                  3
                </span>
                <span className="font-medium text-lg text-slate-500">sesi</span>
              </p>
            </div>
          </div>
          <div className="rounded-2xl shadow-md flex flex-1 items-center p-8 gap-6 bg-white min-w-max">
            <div className="rounded-full p-4 bg-[#CBAD3C] shrink-0">
              <BookOpen className="w-8 h-8" color="#504100" />
            </div>
            <div className="flex flex-col">
              <h4 className="uppercase font-semibold text-md text-[#424942] tracking-wider whitespace-nowrap">
                banyak kelas diambil
              </h4>
              <p className="flex items-baseline gap-2">
                <span className="font-extrabold text-3xl text-slate-800">
                  3
                </span>
                <span className="font-medium text-lg text-slate-500">
                  mata pelajaran
                </span>
              </p>
            </div>
          </div>
        </div>
        {/* card 3 schedule */}
        <div className="flex flex-col gap-4 ">
          {/* header */}
          <div className="flex justify-between items-center p-8 bg-white shadow-md rounded-3xl">
            <h3 className="capitalize text-lg font-semibold">
              jadwal belajar minggu ini
            </h3>
            <button className="text-[#406749] capitalize font-normal cursor-pointer">
              lihat semua
            </button>
          </div>
          {/* card list */}
          <div className="border border-[#DDE4E6] flex justify-between items-center bg-white p-10 rounded-2xl">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="bg-[#8FB996] text-[#244A2F] rounded-xl p-2">
                  09:00 - 11:30
                </div>
                <div className="bg-[#C9EBCB] text-[#04210D] rounded-xl p-2">
                  Matematika
                </div>
              </div>
              <h4 className="font-bold capitalize text-2xl">Budi Santoso</h4>
              <p className="capitalize font-semibold">
                kelas 10 SMA • persiapan ujian
              </p>
            </div>
            <button className="bg-[#406749] text-white rounded-2xl capitalize p-4 font-semibold cursor-pointer">
              hari ini
            </button>
          </div>
          <div className="border border-[#DDE4E6] flex justify-between items-center bg-white p-10 rounded-2xl">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="bg-[#8FB996] text-[#244A2F] rounded-xl p-2">
                  09:00 - 11:30
                </div>
                <div className="bg-[#C9EBCB] text-[#04210D] rounded-xl p-2">
                  Matematika
                </div>
              </div>
              <h4 className="font-bold capitalize text-2xl">Budi Santoso</h4>
              <p className="capitalize font-semibold">
                kelas 10 SMA • persiapan ujian
              </p>
            </div>
            <button className="bg-[#406749] text-white rounded-2xl capitalize p-4 font-semibold cursor-pointer">
              hari ini
            </button>
          </div>
          <div className="border border-[#DDE4E6] flex justify-between items-center bg-white p-10 rounded-2xl ">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <div className="bg-[#8FB996] text-[#244A2F] rounded-xl p-2">
                  09:00 - 11:30
                </div>
                <div className="bg-[#C9EBCB] text-[#04210D] rounded-xl p-2">
                  Matematika
                </div>
              </div>
              <h4 className="font-bold capitalize text-2xl">Budi Santoso</h4>
              <p className="capitalize font-semibold">
                kelas 10 SMA • persiapan ujian
              </p>
            </div>
            <button className="bg-[#406749] text-white rounded-2xl capitalize p-4 font-semibold cursor-pointer">
              hari ini
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
