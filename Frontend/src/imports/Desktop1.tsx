import svgPaths from "./svg-3q9ei7fdys";
import imgImage from "figma:asset/b4180ef08c8a00d3ec4475daad378195b166bb5f.png";
import imgPeople from "figma:asset/50f220e3d4f6db75aa5f1456d019870f02ad0850.png";
import imgCalendar from "figma:asset/38c67111c6c946fab9eadac81ee6d0f484750057.png";
import imgPexelsPixabay417173 from "figma:asset/92c9e342694d8af35af22a88501273fb0580afb9.png";
import imgImage1 from "figma:asset/4a125487cd22cb74a80b40ffb44641b22b9c2eef.png";
import imgImage2 from "figma:asset/dfc06be6d008b8757d98b5f4b4c0365f8143c87a.png";
import imgImage3 from "figma:asset/82b642b6d9d552d34dcfff9db203c236323ef6a1.png";
import imgImage4 from "figma:asset/9735718c52bbd0e1345c5152456fe1b72e5caae6.png";
import imgBed from "figma:asset/2b622d252db0b6e2bb925b481d83743a5b77c8b8.png";

function Component2({ className }: { className?: string }) {
  return (
    <div className={className} data-name="Component 2">
      <div className="absolute bg-white bottom-0 left-0 right-[6.15%] rounded-[5px] top-0" />
      <p className="absolute bottom-[21.05%] font-['Inter:Bold',_sans-serif] font-bold leading-[normal] left-[7.69%] not-italic right-0 text-[20px] text-[blue] top-[21.05%]">Đăng nhập</p>
    </div>
  );
}

function Component1({ className }: { className?: string }) {
  return (
    <div className={className} data-name="Component 1">
      <div className="absolute bottom-[27.27%] left-[76.81%] right-0 top-[22.73%]">
        <div className="absolute inset-[-4.18%_-3.7%_-11.6%_-3.88%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 14">
            <path d="M1 1L8.46667 12L17 1" id="Vector 2" stroke="var(--stroke-0, white)" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <p className="absolute bottom-0 font-['Inter:Regular',_sans-serif] font-normal leading-[normal] left-[39.13%] not-italic right-[23.19%] text-[20px] text-white top-0">VI</p>
      <div className="absolute bottom-[4.54%] left-0 right-[71.01%] top-[9.09%]" data-name="image">
        <img alt="" className="block max-w-none size-full" height="19" src={imgImage} width="20" />
      </div>
    </div>
  );
}

function Component3() {
  return (
    <div className="absolute h-[38px] left-[calc(75%+30px)] top-[24px] w-[130px]" data-name="Component 3">
      <div className="absolute bg-white bottom-0 left-0 right-[6.15%] rounded-[5px] top-0" />
      <p className="absolute bottom-[21.05%] font-['Inter:Bold',_sans-serif] font-bold leading-[normal] left-[7.69%] not-italic right-0 text-[20px] text-[blue] top-[21.05%] whitespace-pre-wrap">{`  Đăng Ký`}</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-[#eebd0e] h-[83px] left-[calc(16.667%+3px)] overflow-clip top-[472px] w-[967px]">
      <div className="absolute bg-white h-[70px] left-[358px] rounded-[7px] top-[6px] w-[234px]" />
      <div className="absolute h-[70px] left-[596px] top-[5px] w-[269px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 269 70">
          <path d={svgPaths.p32d69200} fill="var(--fill-0, white)" id="Rectangle 5" />
        </svg>
      </div>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[normal] left-[644px] not-italic text-[14px] text-black text-nowrap top-[30px] whitespace-pre">2 người lớn · 0 trẻ em · 1 phòng</p>
      <div className="absolute bg-white h-[70px] left-[3px] rounded-[7px] top-[7px] w-[346px]" />
      <div className="absolute bg-[blue] h-[70px] left-[869px] rounded-[7px] top-[6px] w-[95px]" />
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[normal] left-[59px] not-italic text-[14px] text-black text-nowrap top-[33px] whitespace-pre">Hồ Tràm</p>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[normal] left-[387px] not-italic text-[14px] text-black text-nowrap top-[32px] whitespace-pre">Ngày nhận p... - Ngày trả p..</p>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal h-[45px] leading-[normal] left-[897px] not-italic text-[22px] text-white top-[25px] w-[52px]">Tìm</p>
      <div className="absolute h-[30px] left-[601px] top-[24px] w-[29px]" data-name="People">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgPeople} />
      </div>
      <div className="absolute h-[40px] left-[358px] top-[21px] w-[28px]" data-name="Calendar">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgCalendar} />
      </div>
    </div>
  );
}

export default function Desktop1() {
  return (
    <div className="bg-white relative size-full" data-name="Desktop - 1">
      <div className="absolute h-[577px] left-0 top-0 w-[1440px]" data-name="pexels-pixabay-417173">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgPexelsPixabay417173} />
      </div>
      <div className="[text-shadow:rgba(0,0,0,0.25)_0px_4px_4px] absolute font-['Inter:Bold',_sans-serif] font-bold h-[50px] leading-[normal] left-[calc(16.667%+3px)] not-italic text-[17px] text-white top-[88px] w-[834px] whitespace-pre-wrap">
        <p className="mb-0">{` Vé máy bay        Khách sạn               Visa                  Thuê xe           Hoạt động             Tin tức                 More`}</p>
        <p>{`                                                                                                                                vui chơi  `}</p>
      </div>
      <p className="absolute font-['Kadwa:Regular',_sans-serif] h-[36px] leading-[normal] left-[calc(16.667%+3px)] not-italic text-[31px] text-white top-[21px] w-[292px]">Wanderlust</p>
      <p className="absolute font-['Inter:Regular',_sans-serif] font-normal h-[141px] leading-[normal] left-[calc(16.667%+3px)] not-italic text-[40px] text-white top-[183px] w-[1148px]">Từ Đông Nam Á đến thế giới, trong tầm tay bạn</p>
      <div className="absolute bg-white h-[547px] left-0 rounded-[71px] top-[513px] w-[1440px]" />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal h-[74px] leading-[normal] left-[calc(16.667%+3px)] not-italic text-[0px] text-black top-[577px] w-[541px]">
        <p className="font-['Inter:Bold',_sans-serif] font-bold mb-[10px] text-[30px] text-[red]">Săn Sale</p>
        <p className="text-[20px]">Promtion, offers to you</p>
      </div>
      <div className="absolute h-[227px] left-[calc(16.667%+3px)] top-[673px] w-[224px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
      <div className="absolute h-[227px] left-[calc(50%+10px)] top-[673px] w-[224px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage2} />
      </div>
      <div className="absolute h-[227px] left-[calc(66.667%+14px)] top-[673px] w-[224px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage3} />
      </div>
      <div className="absolute h-[227px] left-[calc(33.333%+7px)] top-[673px] w-[224px]" data-name="image">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage4} />
      </div>
      <Component1 className="absolute h-[22px] left-[calc(58.333%+31px)] top-[32px] w-[69px]" />
      <div className="absolute h-[11px] left-[calc(66.667%+88px)] top-[94px] w-[16px]">
        <div className="absolute inset-[-4.18%_-3.7%_-11.6%_-3.88%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 14">
            <path d="M1 1L8.46667 12L17 1" id="Vector 2" stroke="var(--stroke-0, white)" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <Component2 className="absolute h-[38px] left-[66.67%] top-[24px] w-[130px]" />
      <Component3 />
      <Frame1 />
      <div className="absolute h-[40px] left-[calc(16.667%+17px)] top-[492px] w-[28px]" data-name="Bed">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgBed} />
      </div>
    </div>
  );
}