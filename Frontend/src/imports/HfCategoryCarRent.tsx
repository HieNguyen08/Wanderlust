import svgPaths from "./svg-qr7n8pvgvq";
import imgCar from "figma:asset/2385cc01da9bb791587b8022c475d39822c50c17.png";
import imgCar1 from "figma:asset/702f356e48fe531e6fd2626c5d1041dbfcde3341.png";
import imgCar2 from "figma:asset/2e45bdb64d6f5df6dab1d18d948223ba47972f21.png";
import imgCar3 from "figma:asset/509322661844e6b8d2bc7a68f501d79e35f5f4ab.png";
import imgCar4 from "figma:asset/92f74dec074acdd579ecaf8742bac9eede524b1f.png";
import imgCar5 from "figma:asset/f699abef3f5cf908bc1ebc5bf5c91aca676e4157.png";
import imgCar6 from "figma:asset/2ed7554073defa787d71b948931bdf156be51493.png";
import imgCar7 from "figma:asset/94de45fc4c846ab6f28848a6e18426c5160ab67d.png";
import imgImage from "figma:asset/1b63d11335f1fb43cc9220ad021a0ea78cd6328e.png";

function TickSquare() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="tick-square">
        <path d={svgPaths.p431a330} fill="var(--fill-0, #3563E9)" id="Vector" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldTickSquare() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/tick-square">
      <TickSquare />
    </div>
  );
}

function VuesaxBoldTickSquare1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/tick-square">
      <VuesaxBoldTickSquare />
    </div>
  );
}

function Sport() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Sport">
      <VuesaxBoldTickSquare1 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[0px] text-justify tracking-[-0.4px] w-[144px]">
        <p className="leading-[1.5] text-[20px] whitespace-pre-wrap">
          <span className="text-[#596780]">Sport</span>
          <span>{`  (10)`}</span>
        </p>
      </div>
    </div>
  );
}

function TickSquare1() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="tick-square">
        <path d={svgPaths.p431a330} fill="var(--fill-0, #3563E9)" id="Vector" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldTickSquare2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/tick-square">
      <TickSquare1 />
    </div>
  );
}

function VuesaxBoldTickSquare3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/tick-square">
      <VuesaxBoldTickSquare2 />
    </div>
  );
}

function Suv() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="SUV">
      <VuesaxBoldTickSquare3 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[#596780] text-[0px] text-justify tracking-[-0.4px] w-[80px]">
        <p className="leading-[1.5] text-[20px] whitespace-pre-wrap">
          SUV<span className="text-[#90a3bf]">{`  (12)`}</span>
        </p>
      </div>
    </div>
  );
}

function Ceklist() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Ceklist">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Ceklist">
          <path d={svgPaths.p232fb680} id="Vector" stroke="var(--stroke-0, #90A3BF)" />
        </g>
      </svg>
    </div>
  );
}

function Mpv() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="MPV">
      <Ceklist />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[0px] text-justify tracking-[-0.4px] w-[88px]">
        <p className="leading-[1.5] text-[20px] whitespace-pre-wrap">
          <span className="text-[#596780]">MPV</span>
          <span>{`  (16)`}</span>
        </p>
      </div>
    </div>
  );
}

function Ceklist1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Ceklist">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Ceklist">
          <path d={svgPaths.p232fb680} id="Vector" stroke="var(--stroke-0, #90A3BF)" />
        </g>
      </svg>
    </div>
  );
}

function Sedan() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Sedan">
      <Ceklist1 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[0px] text-justify tracking-[-0.4px] w-[112px]">
        <p className="leading-[1.5] text-[20px] whitespace-pre-wrap">
          <span className="text-[#596780]">Sedan</span>
          <span>{`  (20)`}</span>
        </p>
      </div>
    </div>
  );
}

function Ceklist2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Ceklist">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Ceklist">
          <path d={svgPaths.p232fb680} id="Vector" stroke="var(--stroke-0, #90A3BF)" />
        </g>
      </svg>
    </div>
  );
}

function Coupe() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Coupe">
      <Ceklist2 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[0px] text-justify tracking-[-0.4px] w-[112px]">
        <p className="leading-[1.5] text-[20px] whitespace-pre-wrap">
          <span className="text-[#596780]">Coupe</span>
          <span>{`  (14)`}</span>
        </p>
      </div>
    </div>
  );
}

function Ceklist3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Ceklist">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Ceklist">
          <path d={svgPaths.p232fb680} id="Vector" stroke="var(--stroke-0, #90A3BF)" />
        </g>
      </svg>
    </div>
  );
}

function Hatchback() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Hatchback">
      <Ceklist3 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[0px] text-justify tracking-[-0.4px] w-[144px]">
        <p className="leading-[1.5] text-[20px] whitespace-pre-wrap">
          <span className="text-[#596780]">Hatchback</span>
          <span>{`  (14)`}</span>
        </p>
      </div>
    </div>
  );
}

function TYPE() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0" data-name="T Y P E">
      <Sport />
      <Suv />
      <Mpv />
      <Sedan />
      <Coupe />
      <Hatchback />
    </div>
  );
}

function TYPE1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[28px] items-start left-[32px] top-[32px]" data-name="T Y P E">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[20px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[12px] tracking-[-0.24px] w-[104px]">
        <p className="leading-[normal]">T Y P E</p>
      </div>
      <TYPE />
    </div>
  );
}

function TickSquare2() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="tick-square">
        <path d={svgPaths.p431a330} fill="var(--fill-0, #3563E9)" id="Vector" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldTickSquare4() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/tick-square">
      <TickSquare2 />
    </div>
  );
}

function VuesaxBoldTickSquare5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/tick-square">
      <VuesaxBoldTickSquare4 />
    </div>
  );
}

function Component2Person() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="2 Person">
      <VuesaxBoldTickSquare5 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[0px] text-justify tracking-[-0.4px] w-[144px]">
        <p className="leading-[1.5] text-[20px] whitespace-pre-wrap">
          <span className="text-[#596780]">2 Person</span>
          <span>{`  (10)`}</span>
        </p>
      </div>
    </div>
  );
}

function Ceklist4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Ceklist">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Ceklist">
          <path d={svgPaths.p232fb680} id="Vector" stroke="var(--stroke-0, #90A3BF)" />
        </g>
      </svg>
    </div>
  );
}

function Component4Person() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="4 Person">
      <Ceklist4 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[#596780] text-[0px] text-justify tracking-[-0.4px] w-[127px]">
        <p className="leading-[1.5] text-[20px] whitespace-pre-wrap">
          4 Person<span className="text-[#90a3bf]">{`  (14)`}</span>
        </p>
      </div>
    </div>
  );
}

function Ceklist5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Ceklist">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Ceklist">
          <path d={svgPaths.p232fb680} id="Vector" stroke="var(--stroke-0, #90A3BF)" />
        </g>
      </svg>
    </div>
  );
}

function Component6Person() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="6 Person">
      <Ceklist5 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[20px] text-justify tracking-[-0.4px] w-[120px]">
        <p className="leading-[1.5] whitespace-pre-wrap">
          <span className="font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold text-[#596780]">6 Person</span>
          <span>{`  (12)`}</span>
        </p>
      </div>
    </div>
  );
}

function TickSquare3() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="tick-square">
        <path d={svgPaths.p431a330} fill="var(--fill-0, #3563E9)" id="Vector" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldTickSquare6() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/tick-square">
      <TickSquare3 />
    </div>
  );
}

function VuesaxBoldTickSquare7() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/tick-square">
      <VuesaxBoldTickSquare6 />
    </div>
  );
}

function Component8OrMore() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="8 or More">
      <VuesaxBoldTickSquare7 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[0px] text-justify tracking-[-0.4px] w-[144px]">
        <p className="leading-[1.5] text-[20px] whitespace-pre-wrap">
          <span className="text-[#596780]">8 or More</span>
          <span>{`  (16)`}</span>
        </p>
      </div>
    </div>
  );
}

function CAPACITY() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0" data-name="C A P A C I T Y">
      <Component2Person />
      <Component4Person />
      <Component6Person />
      <Component8OrMore />
    </div>
  );
}

function CAPACITY1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[28px] items-start left-[32px] top-[440px]" data-name="C A P A C I T Y">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[20px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[12px] tracking-[-0.24px] w-[104px]">
        <p className="leading-[normal]">C A P A C I T Y</p>
      </div>
      <CAPACITY />
    </div>
  );
}

function PRICERANGE() {
  return (
    <div className="h-[20px] relative shrink-0 w-[296px]" data-name="P R I C E  R A N G E">
      <div className="absolute bottom-[-10%] left-0 right-0 top-[-10%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 296 24">
          <g id="P R I C E  R A N G E">
            <rect fill="var(--fill-0, #90A3BF)" height="12" id="Line2" rx="6" width="296" y="6" />
            <rect fill="var(--fill-0, #3563E9)" height="12" id="Line1" rx="6" width="220" y="6" />
            <circle cx="220" cy="12" fill="var(--fill-0, #3563E9)" id="Mark" r="10" stroke="var(--stroke-0, white)" strokeWidth="4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function PRICERANGE1() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0" data-name="P R I C E  R A N G E">
      <PRICERANGE />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[#596780] text-[20px] text-justify tracking-[-0.4px] w-[296px]">
        <p className="leading-[1.5]">Max. $100.00</p>
      </div>
    </div>
  );
}

function PRICE() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[28px] items-start left-[32px] top-[736px]" data-name="P R I C E">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[20px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[12px] tracking-[-0.24px] w-[104px]">
        <p className="leading-[normal]">P R I C E</p>
      </div>
      <PRICERANGE1 />
    </div>
  );
}

function NavBarSide() {
  return (
    <div className="absolute bg-white h-[1600px] left-0 top-0 w-[360px]" data-name="Nav Bar Side">
      <div className="h-[1600px] overflow-clip relative rounded-[inherit] w-[360px]">
        <TYPE1 />
        <CAPACITY1 />
        <PRICE />
      </div>
      <div aria-hidden="true" className="absolute border-[#f3f5f7] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ButtonRental() {
  return (
    <div className="absolute bg-[#3563e9] box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center px-[20px] py-0 right-[24px] rounded-[4px] top-[320px] w-[116px]" data-name="Button Rental">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[-0.32px] w-[76px]">
        <p className="leading-[1.5]">Rent Now</p>
      </div>
    </div>
  );
}

function CarName() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[4px] items-start leading-[0] left-[24px] top-[24px]" data-name="Car Name">
      <div className="flex flex-col h-[24px] justify-center relative shrink-0 text-[#1a202c] text-[20px] tracking-[-0.6px] w-[128px]">
        <p className="leading-[1.5]">Koenigsegg</p>
      </div>
      <div className="flex flex-col h-[20px] justify-center relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[128px]">
        <p className="leading-[1.5]">Sport</p>
      </div>
    </div>
  );
}

function Price() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[44px] items-start left-[24px] top-[320px]" data-name="price">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold h-[44px] justify-center leading-[0] relative shrink-0 text-[#1a202c] text-[0px] w-[128px]">
        <p className="leading-[normal]">
          <span className="text-[20px]">{`$99.00/ `}</span>
          <span className="text-[#90a3bf] text-[14px]">day</span>
        </p>
      </div>
    </div>
  );
}

function GasStation() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="gas-station">
        <g id="Vector" opacity="0"></g>
        <path d={svgPaths.p212eb500} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
      </g>
    </svg>
  );
}

function VuesaxBoldGasStation() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/gas-station">
      <GasStation />
    </div>
  );
}

function VuesaxBoldGasStation1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/gas-station">
      <VuesaxBoldGasStation />
    </div>
  );
}

function Gasoline() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Gasoline">
      <VuesaxBoldGasStation1 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[28px]">
        <p className="leading-[1.5]">90L</p>
      </div>
    </div>
  );
}

function Car() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Car">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Car">
          <path d={svgPaths.p2fb16b80} fill="var(--fill-0, #90A3BF)" id="Circle 4" />
          <rect fill="var(--fill-0, white)" height="16" id="Circle 3" rx="8" width="16" x="4" y="4" />
          <path d={svgPaths.ped43b00} fill="var(--fill-0, #90A3BF)" id="Circle 2" />
          <rect fill="var(--fill-0, white)" height="8" id="Circle 1" rx="4" width="8" x="8" y="8" />
          <rect fill="var(--fill-0, #90A3BF)" height="4" id="Rectangle 3" width="2" x="11" y="17" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 2" width="4" x="17" y="11" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 1" width="4" x="3" y="11" />
        </g>
      </svg>
    </div>
  );
}

function Car1() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Car">
      <Car />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[52px]">
        <p className="leading-[1.5]">Manual</p>
      </div>
    </div>
  );
}

function Profile2User() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="profile-2user">
        <path d={svgPaths.p85bb080} fill="var(--fill-0, #90A3BF)" id="Vector" />
        <path d={svgPaths.p128ca00} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
        <path d={svgPaths.p266c4000} fill="var(--fill-0, #90A3BF)" id="Vector_3" />
        <path d={svgPaths.p86b9f80} fill="var(--fill-0, #90A3BF)" id="Vector_4" />
        <g id="Vector_5" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldProfile2User() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/profile-2user">
      <Profile2User />
    </div>
  );
}

function VuesaxBoldProfile2User1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/profile-2user">
      <VuesaxBoldProfile2User />
    </div>
  );
}

function Capacity() {
  return (
    <div className="content-stretch flex gap-[7px] items-start relative shrink-0" data-name="Capacity">
      <VuesaxBoldProfile2User1 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[60px]">
        <p className="leading-[1.5]">2 People</p>
      </div>
    </div>
  );
}

function Spesification() {
  return (
    <div className="absolute content-stretch flex gap-[17px] items-start left-[24px] top-[260px]" data-name="Spesification">
      <Gasoline />
      <Car1 />
      <Capacity />
    </div>
  );
}

function Heart() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="heart">
        <path d={svgPaths.p3f458d80} fill="var(--fill-0, #ED3F3F)" id="Vector" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldHeart() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/heart">
      <Heart />
    </div>
  );
}

function VuesaxBoldHeart1() {
  return (
    <div className="absolute left-[269px] size-[24px] top-[24px]" data-name="vuesax/bold/heart">
      <VuesaxBoldHeart />
    </div>
  );
}

function Catalog1() {
  return (
    <div className="bg-white h-[388px] overflow-clip relative rounded-[10px] shrink-0 w-[317px]" data-name="Catalog 1">
      <ButtonRental />
      <CarName />
      <Price />
      <Spesification />
      <div className="absolute h-[84px] left-[22px] top-[124px] w-[272px]" data-name="Car">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[172.41%] left-[-7.04%] max-w-none top-[-48.28%] w-[109.39%]" src={imgCar} />
        </div>
      </div>
      <VuesaxBoldHeart1 />
      <div className="absolute bg-gradient-to-b from-[rgba(255,255,255,0)] h-[66px] left-[26px] to-[#ffffff] top-[166px] w-[264px]" data-name="shadow" />
    </div>
  );
}

function ButtonRental1() {
  return (
    <div className="absolute bg-[#3563e9] box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center px-[20px] py-0 right-[24px] rounded-[4px] top-[320px] w-[116px]" data-name="Button Rental">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[-0.32px] w-[76px]">
        <p className="leading-[1.5]">Rent Now</p>
      </div>
    </div>
  );
}

function CarName1() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[4px] items-start leading-[0] left-[24px] top-[24px]" data-name="Car Name">
      <div className="flex flex-col h-[24px] justify-center relative shrink-0 text-[#1a202c] text-[20px] tracking-[-0.6px] w-[128px]">
        <p className="leading-[1.5]">Nissan GT - R</p>
      </div>
      <div className="flex flex-col h-[20px] justify-center relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[128px]">
        <p className="leading-[1.5]">Sport</p>
      </div>
    </div>
  );
}

function Price1() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[4px] items-start leading-[0] left-[24px] top-[316px]" data-name="price">
      <div className="flex flex-col h-[24px] justify-center relative shrink-0 text-[#1a202c] text-[0px] w-[128px]">
        <p className="leading-[normal]">
          <span className="text-[20px]">{`$80.00/ `}</span>
          <span className="text-[#90a3bf] text-[14px]">day</span>
        </p>
      </div>
      <div className="flex flex-col h-[20px] justify-center relative shrink-0 text-[#90a3bf] text-[14px] w-[128px]">
        <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[normal] line-through">$100.00</p>
      </div>
    </div>
  );
}

function GasStation1() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="gas-station">
        <g id="Vector" opacity="0"></g>
        <path d={svgPaths.p212eb500} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
      </g>
    </svg>
  );
}

function VuesaxBoldGasStation2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/gas-station">
      <GasStation1 />
    </div>
  );
}

function VuesaxBoldGasStation3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/gas-station">
      <VuesaxBoldGasStation2 />
    </div>
  );
}

function Gasoline1() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Gasoline">
      <VuesaxBoldGasStation3 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[28px]">
        <p className="leading-[1.5]">80L</p>
      </div>
    </div>
  );
}

function Car2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Car">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Car">
          <path d={svgPaths.p2fb16b80} fill="var(--fill-0, #90A3BF)" id="Circle 4" />
          <rect fill="var(--fill-0, white)" height="16" id="Circle 3" rx="8" width="16" x="4" y="4" />
          <path d={svgPaths.ped43b00} fill="var(--fill-0, #90A3BF)" id="Circle 2" />
          <rect fill="var(--fill-0, white)" height="8" id="Circle 1" rx="4" width="8" x="8" y="8" />
          <rect fill="var(--fill-0, #90A3BF)" height="4" id="Rectangle 3" width="2" x="11" y="17" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 2" width="4" x="17" y="11" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 1" width="4" x="3" y="11" />
        </g>
      </svg>
    </div>
  );
}

function Car3() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Car">
      <Car2 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[52px]">
        <p className="leading-[1.5]">Manual</p>
      </div>
    </div>
  );
}

function Profile2User1() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="profile-2user">
        <path d={svgPaths.p85bb080} fill="var(--fill-0, #90A3BF)" id="Vector" />
        <path d={svgPaths.p128ca00} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
        <path d={svgPaths.p266c4000} fill="var(--fill-0, #90A3BF)" id="Vector_3" />
        <path d={svgPaths.p86b9f80} fill="var(--fill-0, #90A3BF)" id="Vector_4" />
        <g id="Vector_5" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldProfile2User2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/profile-2user">
      <Profile2User1 />
    </div>
  );
}

function VuesaxBoldProfile2User3() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/profile-2user">
      <VuesaxBoldProfile2User2 />
    </div>
  );
}

function Capacity1() {
  return (
    <div className="content-stretch flex gap-[7px] items-start relative shrink-0" data-name="Capacity">
      <VuesaxBoldProfile2User3 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[60px]">
        <p className="leading-[1.5]">2 People</p>
      </div>
    </div>
  );
}

function Spesification1() {
  return (
    <div className="absolute content-stretch flex gap-[17px] items-start left-[24px] top-[260px]" data-name="Spesification">
      <Gasoline1 />
      <Car3 />
      <Capacity1 />
    </div>
  );
}

function Heart1() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="heart">
        <path d={svgPaths.pd52c6b0} id="Vector" stroke="var(--stroke-0, #90A3BF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxLinearHeart() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/heart">
      <Heart1 />
    </div>
  );
}

function VuesaxLinearHeart1() {
  return (
    <div className="absolute left-[269px] size-[24px] top-[24px]" data-name="vuesax/linear/heart">
      <VuesaxLinearHeart />
    </div>
  );
}

function Catalog2() {
  return (
    <div className="bg-white h-[388px] overflow-clip relative rounded-[10px] shrink-0 w-[317px]" data-name="Catalog 2">
      <ButtonRental1 />
      <CarName1 />
      <Price1 />
      <Spesification1 />
      <div className="absolute flex h-[72px] items-center justify-center left-[44px] top-[130px] w-[228px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[72px] relative w-[228px]" data-name="Car">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[235.37%] left-0 max-w-none top-[-75%] w-full" src={imgCar1} />
            </div>
          </div>
        </div>
      </div>
      <VuesaxLinearHeart1 />
      <div className="absolute bg-gradient-to-b from-[rgba(255,255,255,0)] h-[66px] left-[26px] to-[#ffffff] top-[166px] w-[264px]" data-name="shadow" />
    </div>
  );
}

function ButtonRental2() {
  return (
    <div className="absolute bg-[#3563e9] box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center px-[20px] py-0 right-[24px] rounded-[4px] top-[320px] w-[116px]" data-name="Button Rental">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[-0.32px] w-[76px]">
        <p className="leading-[1.5]">Rent Now</p>
      </div>
    </div>
  );
}

function CarName2() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[4px] items-start leading-[0] left-[24px] top-[24px]" data-name="Car Name">
      <div className="flex flex-col h-[24px] justify-center relative shrink-0 text-[#1a202c] text-[20px] tracking-[-0.6px] w-[128px]">
        <p className="leading-[1.5]">Rolls-Royce</p>
      </div>
      <div className="flex flex-col h-[20px] justify-center relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[128px]">
        <p className="leading-[1.5]">Sport</p>
      </div>
    </div>
  );
}

function Price2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-[24px] top-[320px]" data-name="price">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold h-[44px] justify-center leading-[0] relative shrink-0 text-[#1a202c] text-[0px] w-[128px]">
        <p className="leading-[normal]">
          <span className="text-[20px]">{`$96.00/ `}</span>
          <span className="text-[#90a3bf] text-[14px]">day</span>
        </p>
      </div>
    </div>
  );
}

function GasStation2() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="gas-station">
        <g id="Vector" opacity="0"></g>
        <path d={svgPaths.p212eb500} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
      </g>
    </svg>
  );
}

function VuesaxBoldGasStation4() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/gas-station">
      <GasStation2 />
    </div>
  );
}

function VuesaxBoldGasStation5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/gas-station">
      <VuesaxBoldGasStation4 />
    </div>
  );
}

function Gasoline2() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Gasoline">
      <VuesaxBoldGasStation5 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[28px]">
        <p className="leading-[1.5]">70L</p>
      </div>
    </div>
  );
}

function Car4() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Car">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Car">
          <path d={svgPaths.p2fb16b80} fill="var(--fill-0, #90A3BF)" id="Circle 4" />
          <rect fill="var(--fill-0, white)" height="16" id="Circle 3" rx="8" width="16" x="4" y="4" />
          <path d={svgPaths.ped43b00} fill="var(--fill-0, #90A3BF)" id="Circle 2" />
          <rect fill="var(--fill-0, white)" height="8" id="Circle 1" rx="4" width="8" x="8" y="8" />
          <rect fill="var(--fill-0, #90A3BF)" height="4" id="Rectangle 3" width="2" x="11" y="17" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 2" width="4" x="17" y="11" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 1" width="4" x="3" y="11" />
        </g>
      </svg>
    </div>
  );
}

function Car5() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Car">
      <Car4 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[52px]">
        <p className="leading-[1.5]">Manual</p>
      </div>
    </div>
  );
}

function Profile2User2() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="profile-2user">
        <path d={svgPaths.p85bb080} fill="var(--fill-0, #90A3BF)" id="Vector" />
        <path d={svgPaths.p128ca00} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
        <path d={svgPaths.p266c4000} fill="var(--fill-0, #90A3BF)" id="Vector_3" />
        <path d={svgPaths.p86b9f80} fill="var(--fill-0, #90A3BF)" id="Vector_4" />
        <g id="Vector_5" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldProfile2User4() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/profile-2user">
      <Profile2User2 />
    </div>
  );
}

function VuesaxBoldProfile2User5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/profile-2user">
      <VuesaxBoldProfile2User4 />
    </div>
  );
}

function Capacity2() {
  return (
    <div className="content-stretch flex gap-[7px] items-start relative shrink-0" data-name="Capacity">
      <VuesaxBoldProfile2User5 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[60px]">
        <p className="leading-[1.5]">4 People</p>
      </div>
    </div>
  );
}

function Spesification2() {
  return (
    <div className="absolute content-stretch flex gap-[17px] items-start left-[24px] top-[260px]" data-name="Spesification">
      <Gasoline2 />
      <Car5 />
      <Capacity2 />
    </div>
  );
}

function Heart2() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="heart">
        <path d={svgPaths.pd52c6b0} id="Vector" stroke="var(--stroke-0, #90A3BF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxLinearHeart2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/heart">
      <Heart2 />
    </div>
  );
}

function VuesaxLinearHeart3() {
  return (
    <div className="absolute left-[269px] size-[24px] top-[24px]" data-name="vuesax/linear/heart">
      <VuesaxLinearHeart2 />
    </div>
  );
}

function Catalog3() {
  return (
    <div className="bg-white h-[388px] overflow-clip relative rounded-[10px] shrink-0 w-[317px]" data-name="Catalog 3">
      <ButtonRental2 />
      <CarName2 />
      <Price2 />
      <Spesification2 />
      <div className="absolute flex h-[76px] items-center justify-center left-[36px] top-[128px] w-[244px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[76px] relative w-[244px]" data-name="Car">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgCar2} />
          </div>
        </div>
      </div>
      <VuesaxLinearHeart3 />
      <div className="absolute bg-gradient-to-b from-[rgba(255,255,255,0)] h-[66px] left-[26px] to-[#ffffff] top-[166px] w-[264px]" data-name="shadow" />
    </div>
  );
}

function Catalogue1() {
  return (
    <div className="content-stretch flex gap-[32px] items-start relative shrink-0" data-name="Catalogue 1">
      <Catalog1 />
      <Catalog2 />
      <Catalog3 />
    </div>
  );
}

function ButtonRental3() {
  return (
    <div className="absolute bg-[#3563e9] box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center px-[20px] py-0 right-[24px] rounded-[4px] top-[320px] w-[116px]" data-name="Button Rental">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[-0.32px] w-[76px]">
        <p className="leading-[1.5]">Rent Now</p>
      </div>
    </div>
  );
}

function CarName3() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[4px] items-start leading-[0] left-[24px] top-[24px]" data-name="Car Name">
      <div className="flex flex-col h-[24px] justify-center relative shrink-0 text-[#1a202c] text-[20px] tracking-[-0.6px] w-[128px]">
        <p className="leading-[1.5]">All New Rush</p>
      </div>
      <div className="flex flex-col h-[20px] justify-center relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[128px]">
        <p className="leading-[1.5]">SUV</p>
      </div>
    </div>
  );
}

function Price3() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[4px] items-start leading-[0] left-[24px] top-[316px]" data-name="price">
      <div className="flex flex-col h-[24px] justify-center relative shrink-0 text-[#1a202c] text-[0px] w-[128px]">
        <p className="leading-[normal]">
          <span className="text-[20px]">{`$72.00/ `}</span>
          <span className="text-[#90a3bf] text-[14px]">day</span>
        </p>
      </div>
      <div className="flex flex-col h-[20px] justify-center relative shrink-0 text-[#90a3bf] text-[14px] w-[128px]">
        <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[normal] line-through">$80.00</p>
      </div>
    </div>
  );
}

function GasStation3() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="gas-station">
        <g id="Vector" opacity="0"></g>
        <path d={svgPaths.p212eb500} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
      </g>
    </svg>
  );
}

function VuesaxBoldGasStation6() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/gas-station">
      <GasStation3 />
    </div>
  );
}

function VuesaxBoldGasStation7() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/gas-station">
      <VuesaxBoldGasStation6 />
    </div>
  );
}

function Gasoline3() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Gasoline">
      <VuesaxBoldGasStation7 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[28px]">
        <p className="leading-[1.5]">70L</p>
      </div>
    </div>
  );
}

function Car6() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Car">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Car">
          <path d={svgPaths.p2fb16b80} fill="var(--fill-0, #90A3BF)" id="Circle 4" />
          <rect fill="var(--fill-0, white)" height="16" id="Circle 3" rx="8" width="16" x="4" y="4" />
          <path d={svgPaths.ped43b00} fill="var(--fill-0, #90A3BF)" id="Circle 2" />
          <rect fill="var(--fill-0, white)" height="8" id="Circle 1" rx="4" width="8" x="8" y="8" />
          <rect fill="var(--fill-0, #90A3BF)" height="4" id="Rectangle 3" width="2" x="11" y="17" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 2" width="4" x="17" y="11" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 1" width="4" x="3" y="11" />
        </g>
      </svg>
    </div>
  );
}

function Car7() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Car">
      <Car6 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[52px]">
        <p className="leading-[1.5]">Manual</p>
      </div>
    </div>
  );
}

function Profile2User3() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="profile-2user">
        <path d={svgPaths.p85bb080} fill="var(--fill-0, #90A3BF)" id="Vector" />
        <path d={svgPaths.p128ca00} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
        <path d={svgPaths.p266c4000} fill="var(--fill-0, #90A3BF)" id="Vector_3" />
        <path d={svgPaths.p86b9f80} fill="var(--fill-0, #90A3BF)" id="Vector_4" />
        <g id="Vector_5" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldProfile2User6() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/profile-2user">
      <Profile2User3 />
    </div>
  );
}

function VuesaxBoldProfile2User7() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/profile-2user">
      <VuesaxBoldProfile2User6 />
    </div>
  );
}

function Capacity3() {
  return (
    <div className="content-stretch flex gap-[7px] items-start relative shrink-0" data-name="Capacity">
      <VuesaxBoldProfile2User7 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[60px]">
        <p className="leading-[1.5]">6 People</p>
      </div>
    </div>
  );
}

function Spesification3() {
  return (
    <div className="absolute content-stretch flex gap-[17px] items-start left-[24px] top-[260px]" data-name="Spesification">
      <Gasoline3 />
      <Car7 />
      <Capacity3 />
    </div>
  );
}

function Heart3() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="heart">
        <path d={svgPaths.pd52c6b0} id="Vector" stroke="var(--stroke-0, #90A3BF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxLinearHeart4() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/heart">
      <Heart3 />
    </div>
  );
}

function VuesaxLinearHeart5() {
  return (
    <div className="absolute left-[269px] size-[24px] top-[24px]" data-name="vuesax/linear/heart">
      <VuesaxLinearHeart4 />
    </div>
  );
}

function Catalog4() {
  return (
    <div className="bg-white h-[388px] overflow-clip relative rounded-[10px] shrink-0 w-[317px]" data-name="Catalog 1">
      <ButtonRental3 />
      <CarName3 />
      <Price3 />
      <Spesification3 />
      <div className="absolute h-[112px] left-[32px] top-[110px] w-[252px]" data-name="Car">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[178.57%] left-0 max-w-none top-[-40.18%] w-full" src={imgCar3} />
        </div>
      </div>
      <VuesaxLinearHeart5 />
      <div className="absolute bg-gradient-to-b from-[rgba(255,255,255,0)] h-[66px] left-[26px] to-[#ffffff] top-[166px] w-[264px]" data-name="shadow" />
    </div>
  );
}

function ButtonRental4() {
  return (
    <div className="absolute bg-[#3563e9] box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center px-[20px] py-0 right-[24px] rounded-[4px] top-[320px] w-[116px]" data-name="Button Rental">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[-0.32px] w-[76px]">
        <p className="leading-[1.5]">Rent Now</p>
      </div>
    </div>
  );
}

function CarName4() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[4px] items-start leading-[0] left-[24px] top-[24px]" data-name="Car Name">
      <div className="flex flex-col h-[24px] justify-center relative shrink-0 text-[#1a202c] text-[20px] tracking-[-0.6px] w-[128px]">
        <p className="leading-[1.5] whitespace-pre-wrap">{`CR  - V`}</p>
      </div>
      <div className="flex flex-col h-[20px] justify-center relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[128px]">
        <p className="leading-[1.5]">SUV</p>
      </div>
    </div>
  );
}

function Price4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[44px] items-start left-[24px] top-[320px]" data-name="price">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold h-[44px] justify-center leading-[0] relative shrink-0 text-[#1a202c] text-[0px] w-[128px]">
        <p className="leading-[normal]">
          <span className="text-[20px]">{`$80.00/ `}</span>
          <span className="text-[#90a3bf] text-[14px]">day</span>
        </p>
      </div>
    </div>
  );
}

function GasStation4() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="gas-station">
        <g id="Vector" opacity="0"></g>
        <path d={svgPaths.p212eb500} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
      </g>
    </svg>
  );
}

function VuesaxBoldGasStation8() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/gas-station">
      <GasStation4 />
    </div>
  );
}

function VuesaxBoldGasStation9() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/gas-station">
      <VuesaxBoldGasStation8 />
    </div>
  );
}

function Gasoline4() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Gasoline">
      <VuesaxBoldGasStation9 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[28px]">
        <p className="leading-[1.5]">80L</p>
      </div>
    </div>
  );
}

function Car8() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Car">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Car">
          <path d={svgPaths.p2fb16b80} fill="var(--fill-0, #90A3BF)" id="Circle 4" />
          <rect fill="var(--fill-0, white)" height="16" id="Circle 3" rx="8" width="16" x="4" y="4" />
          <path d={svgPaths.ped43b00} fill="var(--fill-0, #90A3BF)" id="Circle 2" />
          <rect fill="var(--fill-0, white)" height="8" id="Circle 1" rx="4" width="8" x="8" y="8" />
          <rect fill="var(--fill-0, #90A3BF)" height="4" id="Rectangle 3" width="2" x="11" y="17" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 2" width="4" x="17" y="11" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 1" width="4" x="3" y="11" />
        </g>
      </svg>
    </div>
  );
}

function Car9() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Car">
      <Car8 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[52px]">
        <p className="leading-[1.5]">Manual</p>
      </div>
    </div>
  );
}

function Profile2User4() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="profile-2user">
        <path d={svgPaths.p85bb080} fill="var(--fill-0, #90A3BF)" id="Vector" />
        <path d={svgPaths.p128ca00} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
        <path d={svgPaths.p266c4000} fill="var(--fill-0, #90A3BF)" id="Vector_3" />
        <path d={svgPaths.p86b9f80} fill="var(--fill-0, #90A3BF)" id="Vector_4" />
        <g id="Vector_5" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldProfile2User8() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/profile-2user">
      <Profile2User4 />
    </div>
  );
}

function VuesaxBoldProfile2User9() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/profile-2user">
      <VuesaxBoldProfile2User8 />
    </div>
  );
}

function Capacity4() {
  return (
    <div className="content-stretch flex gap-[7px] items-start relative shrink-0" data-name="Capacity">
      <VuesaxBoldProfile2User9 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[60px]">
        <p className="leading-[1.5]">6 People</p>
      </div>
    </div>
  );
}

function Spesification4() {
  return (
    <div className="absolute content-stretch flex gap-[17px] items-start left-[24px] top-[260px]" data-name="Spesification">
      <Gasoline4 />
      <Car9 />
      <Capacity4 />
    </div>
  );
}

function Heart4() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="heart">
        <path d={svgPaths.p3f458d80} fill="var(--fill-0, #ED3F3F)" id="Vector" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldHeart2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/heart">
      <Heart4 />
    </div>
  );
}

function VuesaxBoldHeart3() {
  return (
    <div className="absolute left-[269px] size-[24px] top-[24px]" data-name="vuesax/bold/heart">
      <VuesaxBoldHeart2 />
    </div>
  );
}

function Catalog5() {
  return (
    <div className="bg-white h-[388px] overflow-clip relative rounded-[10px] shrink-0 w-[317px]" data-name="Catalog 2">
      <ButtonRental4 />
      <CarName4 />
      <Price4 />
      <Spesification4 />
      <div className="absolute flex h-[102px] items-center justify-center left-[31px] top-[115px] w-[254px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[102px] relative w-[254px]" data-name="Car">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[109.8%] left-[-3.38%] max-w-none top-[-4.9%] w-[107.55%]" src={imgCar4} />
            </div>
          </div>
        </div>
      </div>
      <VuesaxBoldHeart3 />
      <div className="absolute bg-gradient-to-b from-[rgba(255,255,255,0)] h-[66px] left-[26px] to-[#ffffff] top-[166px] w-[264px]" data-name="shadow" />
    </div>
  );
}

function ButtonRental5() {
  return (
    <div className="absolute bg-[#3563e9] box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center px-[20px] py-0 right-[24px] rounded-[4px] top-[320px] w-[116px]" data-name="Button Rental">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[-0.32px] w-[76px]">
        <p className="leading-[1.5]">Rent Now</p>
      </div>
    </div>
  );
}

function CarName5() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[4px] items-start leading-[0] left-[24px] top-[24px]" data-name="Car Name">
      <div className="flex flex-col h-[24px] justify-center relative shrink-0 text-[#1a202c] text-[20px] tracking-[-0.6px] w-[140px]">
        <p className="leading-[1.5]">All New Terios</p>
      </div>
      <div className="flex flex-col h-[20px] justify-center relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[140px]">
        <p className="leading-[1.5]">SUV</p>
      </div>
    </div>
  );
}

function Price5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[44px] items-start left-[24px] top-[320px]" data-name="price">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold h-[44px] justify-center leading-[0] relative shrink-0 text-[#1a202c] text-[0px] w-[128px]">
        <p className="leading-[normal]">
          <span className="text-[20px]">{`$74.00/ `}</span>
          <span className="text-[#90a3bf] text-[14px]">day</span>
        </p>
      </div>
    </div>
  );
}

function GasStation5() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="gas-station">
        <g id="Vector" opacity="0"></g>
        <path d={svgPaths.p212eb500} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
      </g>
    </svg>
  );
}

function VuesaxBoldGasStation10() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/gas-station">
      <GasStation5 />
    </div>
  );
}

function VuesaxBoldGasStation11() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/gas-station">
      <VuesaxBoldGasStation10 />
    </div>
  );
}

function Gasoline5() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Gasoline">
      <VuesaxBoldGasStation11 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[28px]">
        <p className="leading-[1.5]">90L</p>
      </div>
    </div>
  );
}

function Car10() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Car">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Car">
          <path d={svgPaths.p2fb16b80} fill="var(--fill-0, #90A3BF)" id="Circle 4" />
          <rect fill="var(--fill-0, white)" height="16" id="Circle 3" rx="8" width="16" x="4" y="4" />
          <path d={svgPaths.ped43b00} fill="var(--fill-0, #90A3BF)" id="Circle 2" />
          <rect fill="var(--fill-0, white)" height="8" id="Circle 1" rx="4" width="8" x="8" y="8" />
          <rect fill="var(--fill-0, #90A3BF)" height="4" id="Rectangle 3" width="2" x="11" y="17" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 2" width="4" x="17" y="11" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 1" width="4" x="3" y="11" />
        </g>
      </svg>
    </div>
  );
}

function Car11() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Car">
      <Car10 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[52px]">
        <p className="leading-[1.5]">Manual</p>
      </div>
    </div>
  );
}

function Profile2User5() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="profile-2user">
        <path d={svgPaths.p85bb080} fill="var(--fill-0, #90A3BF)" id="Vector" />
        <path d={svgPaths.p128ca00} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
        <path d={svgPaths.p266c4000} fill="var(--fill-0, #90A3BF)" id="Vector_3" />
        <path d={svgPaths.p86b9f80} fill="var(--fill-0, #90A3BF)" id="Vector_4" />
        <g id="Vector_5" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldProfile2User10() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/profile-2user">
      <Profile2User5 />
    </div>
  );
}

function VuesaxBoldProfile2User11() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/profile-2user">
      <VuesaxBoldProfile2User10 />
    </div>
  );
}

function Capacity5() {
  return (
    <div className="content-stretch flex gap-[7px] items-start relative shrink-0" data-name="Capacity">
      <VuesaxBoldProfile2User11 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[60px]">
        <p className="leading-[1.5]">6 People</p>
      </div>
    </div>
  );
}

function Spesification5() {
  return (
    <div className="absolute content-stretch flex gap-[17px] items-start left-[24px] top-[260px]" data-name="Spesification">
      <Gasoline5 />
      <Car11 />
      <Capacity5 />
    </div>
  );
}

function Heart5() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="heart">
        <path d={svgPaths.pd52c6b0} id="Vector" stroke="var(--stroke-0, #90A3BF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxLinearHeart6() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/heart">
      <Heart5 />
    </div>
  );
}

function VuesaxLinearHeart7() {
  return (
    <div className="absolute left-[269px] size-[24px] top-[24px]" data-name="vuesax/linear/heart">
      <VuesaxLinearHeart6 />
    </div>
  );
}

function Catalog6() {
  return (
    <div className="bg-white h-[388px] overflow-clip relative rounded-[10px] shrink-0 w-[317px]" data-name="Catalog 3">
      <ButtonRental5 />
      <CarName5 />
      <Price5 />
      <Spesification5 />
      <VuesaxLinearHeart7 />
      <div className="absolute h-[112px] left-[32px] top-[110px] w-[252px]" data-name="Car">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[178.57%] left-0 max-w-none top-[-40.18%] w-full" src={imgCar3} />
        </div>
      </div>
      <div className="absolute bg-gradient-to-b from-[rgba(255,255,255,0)] h-[66px] left-[26px] to-[#ffffff] top-[166px] w-[264px]" data-name="shadow" />
    </div>
  );
}

function Catalogue2() {
  return (
    <div className="content-stretch flex gap-[32px] items-start relative shrink-0" data-name="Catalogue 2">
      <Catalog4 />
      <Catalog5 />
      <Catalog6 />
    </div>
  );
}

function ButtonRental6() {
  return (
    <div className="absolute bg-[#3563e9] box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center px-[20px] py-0 right-[24px] rounded-[4px] top-[320px] w-[116px]" data-name="Button Rental">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[-0.32px] w-[76px]">
        <p className="leading-[1.5]">Rent Now</p>
      </div>
    </div>
  );
}

function CarName6() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[4px] items-start leading-[0] left-[24px] top-[24px]" data-name="Car Name">
      <div className="flex flex-col h-[24px] justify-center relative shrink-0 text-[#1a202c] text-[20px] tracking-[-0.6px] w-[160px]">
        <p className="leading-[1.5]">MG ZX Exclusice</p>
      </div>
      <div className="flex flex-col h-[20px] justify-center relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[128px]">
        <p className="leading-[1.5]">Hatchback</p>
      </div>
    </div>
  );
}

function Price6() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[4px] items-start leading-[0] left-[24px] top-[316px]" data-name="price">
      <div className="flex flex-col h-[24px] justify-center relative shrink-0 text-[#1a202c] text-[0px] w-[128px]">
        <p className="leading-[normal]">
          <span className="text-[20px]">{`$76.00/ `}</span>
          <span className="text-[#90a3bf] text-[14px]">day</span>
        </p>
      </div>
      <div className="flex flex-col h-[20px] justify-center relative shrink-0 text-[#90a3bf] text-[14px] w-[128px]">
        <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[normal] line-through">$80.00</p>
      </div>
    </div>
  );
}

function GasStation6() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="gas-station">
        <g id="Vector" opacity="0"></g>
        <path d={svgPaths.p212eb500} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
      </g>
    </svg>
  );
}

function VuesaxBoldGasStation12() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/gas-station">
      <GasStation6 />
    </div>
  );
}

function VuesaxBoldGasStation13() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/gas-station">
      <VuesaxBoldGasStation12 />
    </div>
  );
}

function Gasoline6() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Gasoline">
      <VuesaxBoldGasStation13 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[28px]">
        <p className="leading-[1.5]">70L</p>
      </div>
    </div>
  );
}

function Car12() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Car">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Car">
          <path d={svgPaths.p2fb16b80} fill="var(--fill-0, #90A3BF)" id="Circle 4" />
          <rect fill="var(--fill-0, white)" height="16" id="Circle 3" rx="8" width="16" x="4" y="4" />
          <path d={svgPaths.ped43b00} fill="var(--fill-0, #90A3BF)" id="Circle 2" />
          <rect fill="var(--fill-0, white)" height="8" id="Circle 1" rx="4" width="8" x="8" y="8" />
          <rect fill="var(--fill-0, #90A3BF)" height="4" id="Rectangle 3" width="2" x="11" y="17" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 2" width="4" x="17" y="11" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 1" width="4" x="3" y="11" />
        </g>
      </svg>
    </div>
  );
}

function Car13() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Car">
      <Car12 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[52px]">
        <p className="leading-[1.5]">Electric</p>
      </div>
    </div>
  );
}

function Profile2User6() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="profile-2user">
        <path d={svgPaths.p85bb080} fill="var(--fill-0, #90A3BF)" id="Vector" />
        <path d={svgPaths.p128ca00} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
        <path d={svgPaths.p266c4000} fill="var(--fill-0, #90A3BF)" id="Vector_3" />
        <path d={svgPaths.p86b9f80} fill="var(--fill-0, #90A3BF)" id="Vector_4" />
        <g id="Vector_5" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldProfile2User12() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/profile-2user">
      <Profile2User6 />
    </div>
  );
}

function VuesaxBoldProfile2User13() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/profile-2user">
      <VuesaxBoldProfile2User12 />
    </div>
  );
}

function Capacity6() {
  return (
    <div className="content-stretch flex gap-[7px] items-start relative shrink-0" data-name="Capacity">
      <VuesaxBoldProfile2User13 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[60px]">
        <p className="leading-[1.5]">4 People</p>
      </div>
    </div>
  );
}

function Spesification6() {
  return (
    <div className="absolute content-stretch flex gap-[17px] items-start left-[24px] top-[260px]" data-name="Spesification">
      <Gasoline6 />
      <Car13 />
      <Capacity6 />
    </div>
  );
}

function Heart6() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="heart">
        <path d={svgPaths.pd52c6b0} id="Vector" stroke="var(--stroke-0, #90A3BF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxLinearHeart8() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/heart">
      <Heart6 />
    </div>
  );
}

function VuesaxLinearHeart9() {
  return (
    <div className="absolute left-[269px] size-[24px] top-[24px]" data-name="vuesax/linear/heart">
      <VuesaxLinearHeart8 />
    </div>
  );
}

function Catalog7() {
  return (
    <div className="bg-white h-[388px] overflow-clip relative rounded-[10px] shrink-0 w-[317px]" data-name="Catalog 1">
      <ButtonRental6 />
      <CarName6 />
      <Price6 />
      <Spesification6 />
      <VuesaxLinearHeart9 />
      <div className="absolute h-[108px] left-[26px] top-[112px] w-[264px]" data-name="Car">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgCar5} />
        </div>
      </div>
      <div className="absolute bg-gradient-to-b from-[rgba(255,255,255,0)] h-[66px] left-[26px] to-[#ffffff] top-[166px] w-[264px]" data-name="shadow" />
    </div>
  );
}

function ButtonRental7() {
  return (
    <div className="absolute bg-[#3563e9] box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center px-[20px] py-0 right-[24px] rounded-[4px] top-[320px] w-[116px]" data-name="Button Rental">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[-0.32px] w-[76px]">
        <p className="leading-[1.5]">Rent Now</p>
      </div>
    </div>
  );
}

function CarName7() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[4px] items-start leading-[0] left-[24px] top-[24px]" data-name="Car Name">
      <div className="flex flex-col h-[24px] justify-center relative shrink-0 text-[#1a202c] text-[20px] tracking-[-0.6px] w-[128px]">
        <p className="leading-[1.5]">New MG ZS</p>
      </div>
      <div className="flex flex-col h-[20px] justify-center relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[128px]">
        <p className="leading-[1.5]">SUV</p>
      </div>
    </div>
  );
}

function Price7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[44px] items-start left-[24px] top-[320px]" data-name="price">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold h-[44px] justify-center leading-[0] relative shrink-0 text-[#1a202c] text-[0px] w-[128px]">
        <p className="leading-[normal]">
          <span className="text-[20px]">{`$80.00/ `}</span>
          <span className="text-[#90a3bf] text-[14px]">day</span>
        </p>
      </div>
    </div>
  );
}

function GasStation7() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="gas-station">
        <g id="Vector" opacity="0"></g>
        <path d={svgPaths.p212eb500} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
      </g>
    </svg>
  );
}

function VuesaxBoldGasStation14() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/gas-station">
      <GasStation7 />
    </div>
  );
}

function VuesaxBoldGasStation15() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/gas-station">
      <VuesaxBoldGasStation14 />
    </div>
  );
}

function Gasoline7() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Gasoline">
      <VuesaxBoldGasStation15 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[28px]">
        <p className="leading-[1.5]">80L</p>
      </div>
    </div>
  );
}

function Car14() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Car">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Car">
          <path d={svgPaths.p2fb16b80} fill="var(--fill-0, #90A3BF)" id="Circle 4" />
          <rect fill="var(--fill-0, white)" height="16" id="Circle 3" rx="8" width="16" x="4" y="4" />
          <path d={svgPaths.ped43b00} fill="var(--fill-0, #90A3BF)" id="Circle 2" />
          <rect fill="var(--fill-0, white)" height="8" id="Circle 1" rx="4" width="8" x="8" y="8" />
          <rect fill="var(--fill-0, #90A3BF)" height="4" id="Rectangle 3" width="2" x="11" y="17" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 2" width="4" x="17" y="11" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 1" width="4" x="3" y="11" />
        </g>
      </svg>
    </div>
  );
}

function Car15() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Car">
      <Car14 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[52px]">
        <p className="leading-[1.5]">Manual</p>
      </div>
    </div>
  );
}

function Profile2User7() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="profile-2user">
        <path d={svgPaths.p85bb080} fill="var(--fill-0, #90A3BF)" id="Vector" />
        <path d={svgPaths.p128ca00} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
        <path d={svgPaths.p266c4000} fill="var(--fill-0, #90A3BF)" id="Vector_3" />
        <path d={svgPaths.p86b9f80} fill="var(--fill-0, #90A3BF)" id="Vector_4" />
        <g id="Vector_5" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldProfile2User14() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/profile-2user">
      <Profile2User7 />
    </div>
  );
}

function VuesaxBoldProfile2User15() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/profile-2user">
      <VuesaxBoldProfile2User14 />
    </div>
  );
}

function Capacity7() {
  return (
    <div className="content-stretch flex gap-[7px] items-start relative shrink-0" data-name="Capacity">
      <VuesaxBoldProfile2User15 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[60px]">
        <p className="leading-[1.5]">6 People</p>
      </div>
    </div>
  );
}

function Spesification7() {
  return (
    <div className="absolute content-stretch flex gap-[17px] items-start left-[24px] top-[260px]" data-name="Spesification">
      <Gasoline7 />
      <Car15 />
      <Capacity7 />
    </div>
  );
}

function Heart7() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="heart">
        <path d={svgPaths.pd52c6b0} id="Vector" stroke="var(--stroke-0, #90A3BF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxLinearHeart10() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/linear/heart">
      <Heart7 />
    </div>
  );
}

function VuesaxLinearHeart11() {
  return (
    <div className="absolute left-[269px] size-[24px] top-[24px]" data-name="vuesax/linear/heart">
      <VuesaxLinearHeart10 />
    </div>
  );
}

function Catalog8() {
  return (
    <div className="bg-white h-[388px] overflow-clip relative rounded-[10px] shrink-0 w-[317px]" data-name="Catalog 2">
      <ButtonRental7 />
      <CarName7 />
      <Price7 />
      <Spesification7 />
      <div className="absolute flex h-[120px] items-center justify-center left-[4px] top-[109px] w-[308px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="h-[120px] relative w-[308px]" data-name="Car">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[150%] left-[-12.91%] max-w-none top-[-13.89%] w-[123.09%]" src={imgCar6} />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-gradient-to-b from-[rgba(255,255,255,0)] h-[54px] left-0 to-[#ffffff] top-[178px] w-[317px]" data-name="shadow" />
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-0 top-[104px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "128", "--transform-inner-height": "54" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="bg-gradient-to-b from-[rgba(255,255,255,0)] h-[54px] to-[#ffffff] w-[128px]" data-name="shadow" />
        </div>
      </div>
      <VuesaxLinearHeart11 />
    </div>
  );
}

function ButtonRental8() {
  return (
    <div className="absolute bg-[#3563e9] box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center px-[20px] py-0 right-[24px] rounded-[4px] top-[320px] w-[116px]" data-name="Button Rental">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[-0.32px] w-[76px]">
        <p className="leading-[1.5]">Rent Now</p>
      </div>
    </div>
  );
}

function CarName8() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold gap-[4px] items-start leading-[0] left-[24px] top-[24px]" data-name="Car Name">
      <div className="flex flex-col h-[24px] justify-center relative shrink-0 text-[#1a202c] text-[20px] tracking-[-0.6px] w-[140px]">
        <p className="leading-[1.5]">MG ZX Excite</p>
      </div>
      <div className="flex flex-col h-[20px] justify-center relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[140px]">
        <p className="leading-[1.5]">Hatchback</p>
      </div>
    </div>
  );
}

function Price8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[44px] items-start left-[24px] top-[320px]" data-name="price">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold h-[44px] justify-center leading-[0] relative shrink-0 text-[#1a202c] text-[0px] w-[128px]">
        <p className="leading-[normal]">
          <span className="text-[20px]">{`$74.00/ `}</span>
          <span className="text-[#90a3bf] text-[14px]">day</span>
        </p>
      </div>
    </div>
  );
}

function GasStation8() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="gas-station">
        <g id="Vector" opacity="0"></g>
        <path d={svgPaths.p212eb500} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
      </g>
    </svg>
  );
}

function VuesaxBoldGasStation16() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/gas-station">
      <GasStation8 />
    </div>
  );
}

function VuesaxBoldGasStation17() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/gas-station">
      <VuesaxBoldGasStation16 />
    </div>
  );
}

function Gasoline8() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Gasoline">
      <VuesaxBoldGasStation17 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[28px]">
        <p className="leading-[1.5]">90L</p>
      </div>
    </div>
  );
}

function Car16() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Car">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Car">
          <path d={svgPaths.p2fb16b80} fill="var(--fill-0, #90A3BF)" id="Circle 4" />
          <rect fill="var(--fill-0, white)" height="16" id="Circle 3" rx="8" width="16" x="4" y="4" />
          <path d={svgPaths.ped43b00} fill="var(--fill-0, #90A3BF)" id="Circle 2" />
          <rect fill="var(--fill-0, white)" height="8" id="Circle 1" rx="4" width="8" x="8" y="8" />
          <rect fill="var(--fill-0, #90A3BF)" height="4" id="Rectangle 3" width="2" x="11" y="17" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 2" width="4" x="17" y="11" />
          <rect fill="var(--fill-0, #90A3BF)" height="2" id="Rectangle 1" width="4" x="3" y="11" />
        </g>
      </svg>
    </div>
  );
}

function Car17() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Car">
      <Car16 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[52px]">
        <p className="leading-[1.5]">Electric</p>
      </div>
    </div>
  );
}

function Profile2User8() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="profile-2user">
        <path d={svgPaths.p85bb080} fill="var(--fill-0, #90A3BF)" id="Vector" />
        <path d={svgPaths.p128ca00} fill="var(--fill-0, #90A3BF)" id="Vector_2" />
        <path d={svgPaths.p266c4000} fill="var(--fill-0, #90A3BF)" id="Vector_3" />
        <path d={svgPaths.p86b9f80} fill="var(--fill-0, #90A3BF)" id="Vector_4" />
        <g id="Vector_5" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldProfile2User16() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/profile-2user">
      <Profile2User8 />
    </div>
  );
}

function VuesaxBoldProfile2User17() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="vuesax/bold/profile-2user">
      <VuesaxBoldProfile2User16 />
    </div>
  );
}

function Capacity8() {
  return (
    <div className="content-stretch flex gap-[7px] items-start relative shrink-0" data-name="Capacity">
      <VuesaxBoldProfile2User17 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] tracking-[-0.28px] w-[60px]">
        <p className="leading-[1.5]">4 People</p>
      </div>
    </div>
  );
}

function Spesification8() {
  return (
    <div className="absolute content-stretch flex gap-[17px] items-start left-[24px] top-[260px]" data-name="Spesification">
      <Gasoline8 />
      <Car17 />
      <Capacity8 />
    </div>
  );
}

function Heart8() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
      <g id="heart">
        <path d={svgPaths.p3f458d80} fill="var(--fill-0, #ED3F3F)" id="Vector" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxBoldHeart4() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/bold/heart">
      <Heart8 />
    </div>
  );
}

function VuesaxBoldHeart5() {
  return (
    <div className="absolute left-[269px] size-[24px] top-[24px]" data-name="vuesax/bold/heart">
      <VuesaxBoldHeart4 />
    </div>
  );
}

function Catalog9() {
  return (
    <div className="bg-white h-[388px] overflow-clip relative rounded-[10px] shrink-0 w-[317px]" data-name="Catalog 3">
      <ButtonRental8 />
      <CarName8 />
      <Price8 />
      <Spesification8 />
      <div className="absolute h-[108px] left-[26px] top-[112px] w-[264px]" data-name="Car">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgCar7} />
      </div>
      <div className="absolute bg-gradient-to-b from-[rgba(255,255,255,0)] h-[66px] left-[26px] to-[#ffffff] top-[166px] w-[264px]" data-name="shadow" />
      <VuesaxBoldHeart5 />
    </div>
  );
}

function Catalogue3() {
  return (
    <div className="content-stretch flex gap-[32px] items-start relative shrink-0" data-name="Catalogue 3">
      <Catalog7 />
      <Catalog8 />
      <Catalog9 />
    </div>
  );
}

function CatalogueCar() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-start left-[392px] top-[200px]" data-name="Catalogue Car">
      <Catalogue1 />
      <Catalogue2 />
      <Catalogue3 />
    </div>
  );
}

function ShowMore() {
  return (
    <div className="bg-[#3563e9] box-border content-stretch flex gap-[8px] h-[44px] items-center justify-center px-[20px] py-0 relative rounded-[4px] shrink-0 w-[156px]" data-name="Show More">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[24px] justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white tracking-[-0.32px] w-[116px]">
        <p className="leading-[1.5]">Show more car</p>
      </div>
    </div>
  );
}

function ShowMore1() {
  return (
    <div className="absolute content-stretch flex gap-[290px] items-center left-[822px] top-[1492px]" data-name="Show More">
      <ShowMore />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[24px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[14px] text-right tracking-[-0.28px] w-[140px]">
        <p className="leading-[1.5]">120 Car</p>
      </div>
    </div>
  );
}

function Mark() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="mark">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="mark">
          <rect fill="var(--fill-0, #3563E9)" fillOpacity="0.3" height="16" rx="8" width="16" />
          <circle cx="8" cy="8" fill="var(--fill-0, #3563E9)" id="Ellipse 11" r="4" />
        </g>
      </svg>
    </div>
  );
}

function PickUp() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[24px] top-[24px]" data-name="Pick - Up">
      <Mark />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[20px] justify-center leading-[0] relative shrink-0 text-[#1a202c] text-[16px] tracking-[-0.32px] w-[68px]">
        <p className="leading-[1.5]">Pick - Up</p>
      </div>
    </div>
  );
}

function ArrowDown() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
      <g id="arrow-down">
        <path d={svgPaths.p3ff72680} fill="var(--fill-0, #1A202C)" id="Vector" stroke="var(--stroke-0, #1A202C)" strokeWidth="0.5" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxOutlineArrowDown() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/outline/arrow-down">
      <ArrowDown />
    </div>
  );
}

function VuesaxOutlineArrowDown1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="vuesax/outline/arrow-down">
      <VuesaxOutlineArrowDown />
    </div>
  );
}

function Frame427320631() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[20px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[12px] tracking-[-0.24px] w-[88px]">
        <p className="leading-[normal]">Select your city</p>
      </div>
      <VuesaxOutlineArrowDown1 />
    </div>
  );
}

function Locations() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Locations">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#1a202c] text-[16px] tracking-[-0.32px] w-[77px]">
        <p className="leading-[1.5]">Locations</p>
      </div>
      <Frame427320631 />
    </div>
  );
}

function ArrowDown1() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
      <g id="arrow-down">
        <path d={svgPaths.p3ff72680} fill="var(--fill-0, #1A202C)" id="Vector" stroke="var(--stroke-0, #1A202C)" strokeWidth="0.5" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxOutlineArrowDown2() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/outline/arrow-down">
      <ArrowDown1 />
    </div>
  );
}

function VuesaxOutlineArrowDown3() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="vuesax/outline/arrow-down">
      <VuesaxOutlineArrowDown2 />
    </div>
  );
}

function SelectYourDate() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Select your date">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[20px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[12px] tracking-[-0.24px] w-[94px]">
        <p className="leading-[normal]">Select your date</p>
      </div>
      <VuesaxOutlineArrowDown3 />
    </div>
  );
}

function Date() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Date">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#1a202c] text-[16px] tracking-[-0.32px] w-[48px]">
        <p className="leading-[1.5]">Date</p>
      </div>
      <SelectYourDate />
    </div>
  );
}

function ArrowDown2() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
      <g id="arrow-down">
        <path d={svgPaths.p3ff72680} fill="var(--fill-0, #1A202C)" id="Vector" stroke="var(--stroke-0, #1A202C)" strokeWidth="0.5" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxOutlineArrowDown4() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/outline/arrow-down">
      <ArrowDown2 />
    </div>
  );
}

function VuesaxOutlineArrowDown5() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="vuesax/outline/arrow-down">
      <VuesaxOutlineArrowDown4 />
    </div>
  );
}

function SelectYourTime() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Select your time">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[20px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[12px] tracking-[-0.24px] w-[94px]">
        <p className="leading-[normal]">Select your time</p>
      </div>
      <VuesaxOutlineArrowDown5 />
    </div>
  );
}

function Time() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Time">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#1a202c] text-[16px] tracking-[-0.32px] w-[48px]">
        <p className="leading-[1.5]">Time</p>
      </div>
      <SelectYourTime />
    </div>
  );
}

function PickUp1() {
  return (
    <div className="absolute content-stretch flex gap-[24px] items-start left-[24px] top-[60px]" data-name="Pick - Up">
      <Locations />
      <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "48", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[48px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 1">
                <line id="Line 2" stroke="var(--stroke-0, #C3D4E9)" strokeLinecap="round" strokeOpacity="0.4" x1="0.5" x2="47.5" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Date />
      <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "48", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[48px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 1">
                <line id="Line 2" stroke="var(--stroke-0, #C3D4E9)" strokeLinecap="round" strokeOpacity="0.4" x1="0.5" x2="47.5" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Time />
    </div>
  );
}

function PickUp2() {
  return (
    <div className="absolute h-[132px] left-[392px] overflow-clip rounded-[10px] top-[32px] w-[486px]" data-name="Pick - Up">
      <div className="absolute bg-white h-[136px] left-0 rounded-[10px] top-0 w-[486px]" data-name="bg" />
      <PickUp />
      <PickUp1 />
    </div>
  );
}

function Mark1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="mark">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="mark">
          <rect fill="var(--fill-0, #5CAFFC)" fillOpacity="0.3" height="16" rx="8" width="16" />
          <circle cx="8" cy="8" fill="var(--fill-0, #54A6FF)" id="Ellipse 11" r="4" />
        </g>
      </svg>
    </div>
  );
}

function DropOff() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[24px] top-[24px]" data-name="Drop - Off">
      <Mark1 />
      <div className="flex flex-col font-['Plus_Jakarta_Sans:SemiBold',_sans-serif] font-semibold h-[20px] justify-center leading-[0] relative shrink-0 text-[#1a202c] text-[16px] tracking-[-0.32px] w-[80px]">
        <p className="leading-[1.5]">Drop - Off</p>
      </div>
    </div>
  );
}

function ArrowDown3() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
      <g id="arrow-down">
        <path d={svgPaths.p3ff72680} fill="var(--fill-0, #1A202C)" id="Vector" stroke="var(--stroke-0, #1A202C)" strokeWidth="0.5" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxOutlineArrowDown6() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/outline/arrow-down">
      <ArrowDown3 />
    </div>
  );
}

function VuesaxOutlineArrowDown7() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="vuesax/outline/arrow-down">
      <VuesaxOutlineArrowDown6 />
    </div>
  );
}

function Frame427320632() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[20px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[12px] tracking-[-0.24px] w-[88px]">
        <p className="leading-[normal]">Select your city</p>
      </div>
      <VuesaxOutlineArrowDown7 />
    </div>
  );
}

function Locations1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Locations">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#1a202c] text-[16px] tracking-[-0.32px] w-[77px]">
        <p className="leading-[1.5]">Locations</p>
      </div>
      <Frame427320632 />
    </div>
  );
}

function ArrowDown4() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
      <g id="arrow-down">
        <path d={svgPaths.p3ff72680} fill="var(--fill-0, #1A202C)" id="Vector" stroke="var(--stroke-0, #1A202C)" strokeWidth="0.5" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxOutlineArrowDown8() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/outline/arrow-down">
      <ArrowDown4 />
    </div>
  );
}

function VuesaxOutlineArrowDown9() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="vuesax/outline/arrow-down">
      <VuesaxOutlineArrowDown8 />
    </div>
  );
}

function SelectYourDate1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Select your date">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[20px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[12px] tracking-[-0.24px] w-[94px]">
        <p className="leading-[normal]">Select your date</p>
      </div>
      <VuesaxOutlineArrowDown9 />
    </div>
  );
}

function Date1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Date">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#1a202c] text-[16px] tracking-[-0.32px] w-[48px]">
        <p className="leading-[1.5]">Date</p>
      </div>
      <SelectYourDate1 />
    </div>
  );
}

function ArrowDown5() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
      <g id="arrow-down">
        <path d={svgPaths.p3ff72680} fill="var(--fill-0, #1A202C)" id="Vector" stroke="var(--stroke-0, #1A202C)" strokeWidth="0.5" />
        <g id="Vector_2" opacity="0"></g>
      </g>
    </svg>
  );
}

function VuesaxOutlineArrowDown10() {
  return (
    <div className="absolute contents inset-0" data-name="vuesax/outline/arrow-down">
      <ArrowDown5 />
    </div>
  );
}

function VuesaxOutlineArrowDown11() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="vuesax/outline/arrow-down">
      <VuesaxOutlineArrowDown10 />
    </div>
  );
}

function SelectYourTime1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Select your time">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',_sans-serif] font-medium h-[20px] justify-center leading-[0] relative shrink-0 text-[#90a3bf] text-[12px] tracking-[-0.24px] w-[94px]">
        <p className="leading-[normal]">Select your time</p>
      </div>
      <VuesaxOutlineArrowDown11 />
    </div>
  );
}

function Time1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Time">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',_sans-serif] font-bold h-[20px] justify-center leading-[0] relative shrink-0 text-[#1a202c] text-[16px] tracking-[-0.32px] w-[48px]">
        <p className="leading-[1.5]">Time</p>
      </div>
      <SelectYourTime1 />
    </div>
  );
}

function DropOff1() {
  return (
    <div className="absolute content-stretch flex gap-[24px] items-start left-[24px] top-[60px]" data-name="Drop - Off">
      <Locations1 />
      <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "48", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[48px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 1">
                <line id="Line 2" stroke="var(--stroke-0, #C3D4E9)" strokeLinecap="round" strokeOpacity="0.4" x1="0.5" x2="47.5" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Date1 />
      <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "48", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[90deg]">
          <div className="h-0 relative w-[48px]">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 1">
                <line id="Line 2" stroke="var(--stroke-0, #C3D4E9)" strokeLinecap="round" strokeOpacity="0.4" x1="0.5" x2="47.5" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Time1 />
    </div>
  );
}

function DropOff2() {
  return (
    <div className="absolute h-[132px] left-[921px] overflow-clip rounded-[10px] top-[27px] w-[486px]" data-name="Drop - Off">
      <div className="absolute bg-white h-[136px] left-0 rounded-[10px] top-0 w-[486px]" data-name="bg" />
      <DropOff />
      <DropOff1 />
    </div>
  );
}

function Swap() {
  return (
    <div className="absolute inset-[15.97%_12.85%_15.98%_11.81%]" data-name="Swap">
      <div className="absolute inset-[-4.56%_-4.15%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 19">
          <g id="Swap">
            <path d="M15.0061 17.4646V3.73616" id="Stroke 1" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p35658500} id="Stroke 3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d="M5.07767 1.00056V14.729" id="Stroke 5" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p37fb1a80} id="Stroke 7" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IconlyLightSwap() {
  return (
    <div className="relative size-full" data-name="Iconly/Light/Swap">
      <Swap />
    </div>
  );
}

function Switch() {
  return (
    <div className="absolute contents h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] left-[868px] top-[67px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" data-name="Switch">
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[871px] top-[82px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "48", "--transform-inner-height": "60" } as React.CSSProperties}>
        <div className="flex-none rotate-[270deg]">
          <div className="bg-[rgba(16,50,147,0.32)] blur-[20px] filter h-[60px] rounded-[10px] w-[48px]" data-name="Shadow" />
        </div>
      </div>
      <div className="absolute flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center left-[868px] top-[67px] w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "60", "--transform-inner-height": "60" } as React.CSSProperties}>
        <div className="flex-none rotate-[270deg]">
          <div className="bg-[#3563e9] rounded-[10px] size-[60px]" data-name="Bg Button" />
        </div>
      </div>
      <div className="absolute flex inset-[5.31%_36.81%_93.19%_61.53%] items-center justify-center">
        <div className="flex-none h-[24.195px] rotate-[180deg] w-[24px]">
          <IconlyLightSwap />
        </div>
      </div>
    </div>
  );
}

function Content() {
  return (
    <div className="absolute bg-[#f6f7f9] h-[1613px] left-0 overflow-clip top-[111px] w-[1440px]" data-name="Content">
      <NavBarSide />
      <CatalogueCar />
      <ShowMore1 />
      <PickUp2 />
      <DropOff2 />
      <Switch />
    </div>
  );
}

function Component1() {
  return (
    <div className="absolute h-[19px] left-[839px] top-[22px] w-[65px]" data-name="Component 1">
      <div className="absolute bottom-[27.27%] left-[76.81%] right-0 top-[22.73%]">
        <div className="absolute inset-[-5.1%_-3.8%_-12.71%_-4%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 12">
            <path d="M1 1L8.03382 10.5L16.0725 1" id="Vector 2" stroke="var(--stroke-0, white)" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <p className="absolute bottom-0 font-['Inter:Regular',_sans-serif] font-normal leading-[normal] left-[39.13%] not-italic right-[23.19%] text-[20px] text-white top-0">VI</p>
      <div className="absolute bottom-[4.54%] left-0 right-[71.01%] top-[9.09%]" data-name="image">
        <img alt="" className="block max-w-none size-full" height="16.409" src={imgImage} width="18.841" />
      </div>
    </div>
  );
}

function Component2() {
  return (
    <div className="absolute h-[34px] left-[923px] top-[14px] w-[133px]" data-name="Component 2">
      <div className="absolute bg-white bottom-0 left-0 right-[6.15%] rounded-[5px] top-0" />
      <p className="absolute bottom-[21.05%] font-['Inter:Bold',_sans-serif] font-bold leading-[normal] left-[7.69%] not-italic right-0 text-[20px] text-[blue] top-[21.05%]">Đăng nhập</p>
    </div>
  );
}

function Component3() {
  return (
    <div className="absolute h-[34px] left-[1062px] top-[14px] w-[121px]" data-name="Component 3">
      <div className="absolute bg-white bottom-0 left-0 right-[6.15%] rounded-[5px] top-0" />
      <p className="absolute bottom-[21.05%] font-['Inter:Bold',_sans-serif] font-bold leading-[normal] left-[7.69%] not-italic right-0 text-[20px] text-[blue] top-[21.05%] whitespace-pre-wrap">{`  Đăng Ký`}</p>
    </div>
  );
}

function Frame121() {
  return (
    <div className="absolute bg-[#0194f3] h-[111px] left-0 top-0 w-[1429px]">
      <div className="[text-shadow:rgba(0,0,0,0.25)_0px_4px_4px] absolute font-['Inter:Bold',_sans-serif] font-bold h-[43px] leading-[normal] left-[257px] not-italic text-[17px] text-white top-[70px] w-[805px] whitespace-pre-wrap">
        <p className="mb-0">{` Vé máy bay        Khách sạn               Visa                  Thuê xe           Hoạt động             Tin tức                 More`}</p>
        <p>{`                                                                                                                                vui chơi  `}</p>
      </div>
      <p className="absolute font-['Kadwa:Regular',_sans-serif] h-[32px] leading-[normal] left-[257px] not-italic text-[31px] text-white top-[11px] w-[270px]">Wanderlust</p>
      <Component1 />
      <div className="absolute h-[9px] left-[1064px] top-[78px] w-[15px]">
        <div className="absolute inset-[-5.54%_-3.74%_-13.02%_-3.95%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 12">
            <path d="M1 1L8 10L16 1" id="Vector 1" stroke="var(--stroke-0, white)" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <Component2 />
      <Component3 />
    </div>
  );
}

function WordmarkWhite() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0" data-name="Wordmark White">
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[32px] text-nowrap text-white whitespace-pre">Wanderlust</p>
    </div>
  );
}

function FooterColumnHeader() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer column header">
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre">Company</p>
    </div>
  );
}

function FooterListItem() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">About</p>
    </div>
  );
}

function FooterListItem1() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Careers</p>
    </div>
  );
}

function FooterListItem2() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Partnerships</p>
    </div>
  );
}

function FooterListItem3() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Blog</p>
    </div>
  );
}

function FooterListItem4() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Advertising</p>
    </div>
  );
}

function FooterListItem5() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">How we work</p>
    </div>
  );
}

function ColumnCompany() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-[16px] pl-0 pr-[16px] pt-0 relative shrink-0" data-name="column / company">
      <FooterColumnHeader />
      <FooterListItem />
      <FooterListItem1 />
      <FooterListItem2 />
      <FooterListItem3 />
      <FooterListItem4 />
      <FooterListItem5 />
    </div>
  );
}

function FooterColumnHeader1() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer column header">
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre">Policies</p>
    </div>
  );
}

function FooterListItem6() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Privacy</p>
    </div>
  );
}

function FooterListItem7() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Terms of Use</p>
    </div>
  );
}

function FooterListItem8() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Accessibility</p>
    </div>
  );
}

function FooterListItem9() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Cookies</p>
    </div>
  );
}

function ColumnPolicies() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-[16px] pl-0 pr-[16px] pt-0 relative shrink-0" data-name="column / policies">
      <FooterColumnHeader1 />
      <FooterListItem6 />
      <FooterListItem7 />
      <FooterListItem8 />
      <FooterListItem9 />
    </div>
  );
}

function FooterColumnHeader2() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer column header">
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre">Help</p>
    </div>
  );
}

function FooterListItem10() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Support</p>
    </div>
  );
}

function FooterListItem11() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Cancel your booking</p>
    </div>
  );
}

function FooterListItem12() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Refund policies</p>
    </div>
  );
}

function FooterListItem13() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Use a coupon</p>
    </div>
  );
}

function FooterListItem14() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Travel documents</p>
    </div>
  );
}

function ColumnHelp() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-[16px] pl-0 pr-[16px] pt-0 relative shrink-0" data-name="column / help">
      <FooterColumnHeader2 />
      <FooterListItem10 />
      <FooterListItem11 />
      <FooterListItem12 />
      <FooterListItem13 />
      <FooterListItem14 />
    </div>
  );
}

function FooterColumnHeader3() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer column header">
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre">More</p>
    </div>
  );
}

function FooterListItem15() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Airline fees</p>
    </div>
  );
}

function FooterListItem16() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Airlines</p>
    </div>
  );
}

function FooterListItem17() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Low fare trips</p>
    </div>
  );
}

function FooterListItem18() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start p-[4px] relative shrink-0" data-name="Footer list item">
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">{`Badges & Certificates`}</p>
    </div>
  );
}

function ColumnMore() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-[16px] pl-0 pr-[16px] pt-0 relative shrink-0" data-name="column / more">
      <FooterColumnHeader3 />
      <FooterListItem15 />
      <FooterListItem16 />
      <FooterListItem17 />
      <FooterListItem18 />
    </div>
  );
}

function FooterContent() {
  return (
    <div className="bg-[#153a43] relative shrink-0 w-full" data-name="footer content">
      <div className="size-full">
        <div className="box-border content-stretch flex items-start justify-between pb-[24px] pt-[60px] px-[120px] relative w-full">
          <WordmarkWhite />
          <ColumnCompany />
          <ColumnPolicies />
          <ColumnHelp />
          <ColumnMore />
        </div>
      </div>
    </div>
  );
}

function FooterDivider() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="footer / divider">
      <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 2">
          <g id="footer / divider">
            <rect fill="#153A43" height="0.0001133" transform="translate(0 1)" width="1440" />
            <path d="M0 1.00011L1440 1.00008" id="footer / divider_2" stroke="var(--stroke-0, #CBD4E6)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Component24Twitter() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="24 / twitter">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="24 / twitter">
          <path d={svgPaths.pfb1df80} fill="var(--fill-0, white)" id="path" />
        </g>
      </svg>
    </div>
  );
}

function Component24Instagram() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="24 / instagram">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="24 / instagram">
          <path d={svgPaths.p2837cb00} fill="var(--fill-0, white)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function Component24Facebook() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="24 / facebook">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="24 / facebook">
          <path d={svgPaths.p26841d31} fill="var(--fill-0, white)" id="icon" />
        </g>
      </svg>
    </div>
  );
}

function SocialMediaStack() {
  return (
    <div className="box-border content-stretch flex gap-[20px] items-start p-[8px] relative shrink-0" data-name="social media stack">
      <Component24Twitter />
      <Component24Instagram />
      <Component24Facebook />
    </div>
  );
}

function Bottom() {
  return (
    <div className="bg-[#153a43] h-[64px] relative shrink-0 w-full" data-name="bottom">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[64px] items-center justify-between px-[120px] py-[12px] relative w-full">
          <SocialMediaStack />
          <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[18px] text-right text-white w-[178px]">© 2023 GlobGoer Inc.</p>
        </div>
      </div>
    </div>
  );
}

function DesktopFooter() {
  return (
    <div className="absolute bg-[#153a43] box-border content-stretch flex flex-col gap-[17px] items-start left-0 px-0 py-[16px] top-[1724px] w-[1440px]" data-name="Desktop Footer">
      <FooterContent />
      <FooterDivider />
      <Bottom />
    </div>
  );
}

export default function HfCategoryCarRent() {
  return (
    <div className="relative size-full" data-name="HF - Category Car Rent">
      <Content />
      <Frame121 />
      <DesktopFooter />
    </div>
  );
}