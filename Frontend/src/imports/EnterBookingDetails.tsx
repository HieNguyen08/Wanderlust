import svgPaths from "./svg-hwt49vcm5d";
import imgPlane from "figma:asset/4e4568c40fc318ffcf8a54551f25179944f0b7aa.png";
import imgPlaneFlyingOverThePlanet from "figma:asset/8726c448156a3eead3cd13f00d62a1746fcb6965.png";
import imgPlane1 from "figma:asset/2a20e590489499b42a1b4cbcd30770b1d5e40fc6.png";
import imgTwoTickets from "figma:asset/b538f4507f8d8abb77f4276737fd5f0048c8d5a9.png";
import imgTravelator from "figma:asset/70d83a81de00add22a0fbc6b9b0b9600f505418c.png";
import imgTraveler from "figma:asset/661d9b7d3b9f0d6a53feb2a2946f717c02ce512f.png";
import imgSuitcase from "figma:asset/a460d698fab3e17b3f765e411b615f683a2670ec.png";
import imgExpandArrow from "figma:asset/dcd47a1e45cd3e3612583282f530716265645b7e.png";
import imgCalendar from "figma:asset/5ef6c3ea9b0d52abb1df4643e27260e197d01047.png";
import imgPlus from "figma:asset/c8f6378d2bae132c5910bb4b1714546dcb7ea338.png";
import imgImage from "figma:asset/1b63d11335f1fb43cc9220ad021a0ea78cd6328e.png";

function Frame45() {
  return (
    <div className="content-stretch flex font-['Arya:Regular',_sans-serif] items-start not-italic relative shrink-0 text-[16px] text-black text-center text-nowrap">
      <p className="leading-[normal] relative shrink-0 whitespace-pre">Sunday, 29th Jan</p>
      <ul className="[white-space-collapse:collapse] block leading-[0] relative shrink-0">
        <li className="list-inside ms-[24px]">
          <span className="leading-[normal]">Non stop</span>
        </li>
      </ul>
      <ul className="[white-space-collapse:collapse] block leading-[0] relative shrink-0">
        <li className="list-inside ms-[24px]">
          <span className="leading-[normal]">9hr 50min</span>
        </li>
      </ul>
    </div>
  );
}

function Frame46() {
  return (
    <div className="content-stretch flex flex-col gap-[13px] items-start relative shrink-0">
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[32px] text-black text-center text-nowrap whitespace-pre">{`Nairobi (NBI) -> Mombasa (MBO)`}</p>
      <Frame45 />
    </div>
  );
}

function TripHeader() {
  return (
    <div className="relative shrink-0 w-full" data-name="Trip Header">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex gap-[16px] items-center p-[8px] relative w-full">
          <div className="relative shrink-0 size-[96px]" data-name="Plane">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgPlane} />
          </div>
          <Frame46 />
        </div>
      </div>
    </div>
  );
}

function BrandAirline() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center p-[4px] relative shrink-0" data-name="Brand Airline">
      <div className="relative shrink-0 size-[32px]" data-name="Plane flying over the planet">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgPlaneFlyingOverThePlanet} />
      </div>
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre">ABC Airline</p>
    </div>
  );
}

function RefundableStatus() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0" data-name="Refundable Status">
      <p className="font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] leading-[normal] relative shrink-0 text-[#dc3545] text-[14px] text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        Không hoàn trả
      </p>
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex gap-[4px] items-start leading-[normal] relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre">
      <p className="font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] relative shrink-0" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        Hạng vé:
      </p>
      <p className="font-['Arya:Bold',_sans-serif] not-italic relative shrink-0">Economy</p>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <BrandAirline />
      <RefundableStatus />
      <Frame47 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-black text-nowrap whitespace-pre">
      <p className="font-['Arya:Bold',_sans-serif] relative shrink-0 text-[18px]">NBI</p>
      <p className="font-['Arya:Bold',_sans-serif] relative shrink-0 text-[16px]">14.50</p>
      <p className="font-['Arya:Regular',_sans-serif] relative shrink-0 text-[12px]">Sun, 29 Jan 2023</p>
      <div className="font-['Arya:Regular',_sans-serif] relative shrink-0 text-[12px]">
        <p className="mb-0">Moi Intl, Mombasa</p>
        <p>Kenya</p>
      </div>
      <p className="font-['Arya:Regular',_sans-serif] relative shrink-0 text-[12px]">Terminal - 2, Gate - 25</p>
    </div>
  );
}

function Frame51() {
  return (
    <div className="[grid-area:1_/_1] h-[20px] ml-0 mt-0 relative w-[140px]">
      <div className="absolute bottom-0 left-[-0.36%] right-0 top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 141 20">
          <g id="Frame 51">
            <path d={svgPaths.p6b28730} fill="var(--stroke-0, #C8C8C8)" id="Line 1" />
            <path d={svgPaths.p27a25900} fill="var(--stroke-0, #C8C8C8)" id="Line 2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Frame51 />
      <div className="[grid-area:1_/_1] ml-[62px] mt-[1.386px] relative size-[16px]" data-name="Plane">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgPlane1} />
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0">
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">9hr 50min</p>
      <Group3 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] not-italic relative shrink-0 text-black text-nowrap whitespace-pre">
      <p className="font-['Arya:Bold',_sans-serif] relative shrink-0 text-[18px]">MBO</p>
      <p className="font-['Arya:Bold',_sans-serif] relative shrink-0 text-[16px]">14.50</p>
      <p className="font-['Arya:Regular',_sans-serif] relative shrink-0 text-[12px]">Sun, 29 Jan 2023</p>
      <div className="font-['Arya:Regular',_sans-serif] relative shrink-0 text-[12px]">
        <p className="mb-0">JFK Terminal, Nairobi,</p>
        <p>Kenya</p>
      </div>
      <p className="font-['Arya:Regular',_sans-serif] relative shrink-0 text-[12px]">Terminal - 2, Gate - 25</p>
    </div>
  );
}

function FlightDetails() {
  return (
    <div className="box-border content-stretch flex gap-[16px] items-center p-[8px] relative rounded-[4px] shrink-0" data-name="Flight Details">
      <Frame22 />
      <Frame26 />
      <Frame24 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-nowrap whitespace-pre">
      <p className="font-['Arya:Regular',_sans-serif] relative shrink-0">Buggage</p>
      <p className="font-['Arya:Bold',_sans-serif] relative shrink-0">ADULT</p>
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-nowrap whitespace-pre">
      <p className="font-['Arya:Regular',_sans-serif] relative shrink-0">Check-in</p>
      <p className="font-['Arya:Bold',_sans-serif] relative shrink-0">23Kgs (1 Piece * 23Kgs)</p>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-nowrap whitespace-pre">
      <p className="font-['Arya:Regular',_sans-serif] relative shrink-0">Cabin</p>
      <p className="font-['Arya:Bold',_sans-serif] relative shrink-0">7Kgs (1 Piece * 7kgs)</p>
    </div>
  );
}

function Frame66() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
      <Frame30 />
      <Frame28 />
      <Frame29 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="bg-[#fff1e4] relative rounded-[4px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex items-center justify-between p-[8px] relative w-full">
          <FlightDetails />
          <Frame66 />
        </div>
      </div>
    </div>
  );
}

function SeparateTickets() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Separate Tickets">
      <div className="relative shrink-0 size-[12px]" data-name="Two Tickets">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgTwoTickets} />
      </div>
      <p className="font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] leading-[normal] relative shrink-0 text-[12px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        Ưu đãi khi mua vé theo nhóm
      </p>
    </div>
  );
}

function TerminalChange() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Terminal Change">
      <div className="relative shrink-0 size-[12px]" data-name="Travelator">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgTravelator} />
      </div>
      <p className="font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] leading-[normal] relative shrink-0 text-[12px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        Phí thay đổi giờ bay
      </p>
    </div>
  );
}

function SelfTransfer() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Self Transfer">
      <div className="relative shrink-0 size-[12px]" data-name="Traveler">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgTraveler} />
      </div>
      <p className="font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] leading-[normal] relative shrink-0 text-[12px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        Phí vận chuyển hành lý
      </p>
    </div>
  );
}

function LuggageSize() {
  return (
    <div className="content-stretch flex gap-[4px] items-end relative shrink-0" data-name="Luggage Size">
      <div className="relative shrink-0 size-[12px]" data-name="Suitcase">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgSuitcase} />
      </div>
      <p className="font-['Arya:Regular',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-black text-nowrap whitespace-pre">7kg</p>
    </div>
  );
}

function Frame50() {
  return (
    <div className="box-border content-stretch flex gap-[16px] items-center px-0 py-[4px] relative shrink-0 w-full">
      <SeparateTickets />
      <TerminalChange />
      <SelfTransfer />
      <LuggageSize />
    </div>
  );
}

function Alert() {
  return (
    <div className="bg-[#e9ecef] relative rounded-[4px] shrink-0 w-full" data-name="alert">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center p-[8px] relative w-full">
          <div className="relative shrink-0 size-[12px]" data-name="Traveler">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgTraveler} />
          </div>
          <p className="font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] leading-[normal] relative shrink-0 text-[12px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>{`Xin cáo lỗi quý khách  vì chưa có quy định chính sách về hành lý quá cân và hành lý ký gửi`}</p>
        </div>
      </div>
    </div>
  );
}

function FlightTripSummary() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start relative rounded-[4px] shrink-0 w-[834px]" data-name="Flight trip summary">
      <Frame27 />
      <Frame31 />
      <Frame50 />
      <Alert />
    </div>
  );
}

function TripSummary() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[16px] relative rounded-[4px] shadow-[0px_4px_4px_0px_rgba(141,141,141,0.25)] shrink-0" data-name="Trip Summary">
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[18px] text-black text-nowrap whitespace-pre">Flight Summary</p>
      <FlightTripSummary />
    </div>
  );
}

function Header() {
  return (
    <div className="relative shrink-0 w-full" data-name="Header">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between p-[10px] relative w-full">
          <p className="font-['Arya:Bold',_'Noto_Sans:Bold',_sans-serif] leading-[normal] relative shrink-0 text-[18px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 700" }}>
            Hướng dẫn quan trọng
          </p>
          <div className="relative shrink-0 size-[18px]" data-name="Expand Arrow">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgExpandArrow} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Body() {
  return (
    <div className="h-[144px] relative shrink-0 w-full" data-name="Body">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[10px] h-[144px] items-start p-[10px] relative w-full">
          <div className="basis-0 font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] grow leading-[normal] min-h-px min-w-px relative shrink-0 text-[14px] text-black" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
            <p className="mb-0">
              Khi đặt vé máy bay, điều quan trọng là hành khách phải tuân theo một số nguyên tắc nhất định để đảm bảo trải nghiệm suôn sẻ và không căng thẳng. Dưới đây là một số hướng dẫn quan trọng mà hành khách cần tuân thủ khi đặt vé máy bay:
              <br aria-hidden="true" />
              <br aria-hidden="true" />
              1. Kiểm tra kỹ thông tin chuyến đi: Trước khi xác nhận đặt chỗ, hãy xem xét cẩn thận tất cả thông tin chuyến đi, bao gồm ngày, điểm đến và thông tin hành khách. Đảm bảo thông tin nhập vào là chính xác để tránh những rắc rối sau này.
            </p>
            <p>&nbsp;</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start px-[16px] py-[8px] relative rounded-[4px] shrink-0" data-name="Button">
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0194f3] text-[14px] text-nowrap whitespace-pre">Xem thêm</p>
    </div>
  );
}

function ImportantGuidelines() {
  return (
    <div className="bg-white relative rounded-[4px] shadow-[0px_4px_4px_0px_rgba(141,141,141,0.25)] shrink-0 w-full" data-name="Important Guidelines">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col items-start p-[16px] relative w-full">
          <Header />
          <Body />
          <Button />
        </div>
      </div>
    </div>
  );
}

function Component18ChevronDown() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="18 / chevron down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="18 / chevron down">
          <path d={svgPaths.pcc7fd00} fill="var(--fill-0, #6E7491)" id="Vector 8" />
        </g>
      </svg>
    </div>
  );
}

function BasePillChit() {
  return (
    <div className="bg-white h-full relative rounded-[4px] shrink-0" data-name=".base / pill chit">
      <div className="box-border content-stretch flex gap-[4px] h-full items-center overflow-clip pl-[16px] pr-[12px] py-[8px] relative rounded-[inherit]">
        <div className="flex flex-col font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] justify-center leading-[0] relative shrink-0 text-[#27273f] text-[16px] text-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[normal] whitespace-pre">MÃ quốc gia</p>
        </div>
        <Component18ChevronDown />
      </div>
      <div aria-hidden="true" className="absolute border border-[#a1b0cc] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function PilllChit() {
  return (
    <div className="content-stretch flex items-start relative self-stretch shrink-0" data-name="Pilll Chit">
      <BasePillChit />
    </div>
  );
}

function BaseTextInput() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name=".base / text input">
      <div className="flex flex-row items-end overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-end px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Arya:Regular',_sans-serif] grow h-[32px] justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#7c8db0] text-[16px]">
            <p className="leading-[normal]">Mobile numbers</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#a1b0cc] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function TextInput() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-[252px]" data-name="Text Input">
      <BaseTextInput />
    </div>
  );
}

function Frame98() {
  return (
    <div className="content-stretch flex gap-[4px] items-start relative shrink-0">
      <PilllChit />
      <TextInput />
    </div>
  );
}

function Frame72() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] justify-center leading-[0] relative shrink-0 text-[16px] text-black text-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[normal] whitespace-pre">Số điện thoại</p>
      </div>
      <Frame98 />
    </div>
  );
}

function BaseTextInput1() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name=".base / text input">
      <div className="flex flex-row items-end overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-end px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Arya:Regular',_sans-serif] grow h-[32px] justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#7c8db0] text-[16px]">
            <p className="leading-[normal]">Email</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#a1b0cc] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function TextInput1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-full" data-name="Text Input">
      <BaseTextInput1 />
    </div>
  );
}

function Frame73() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col font-['Arya:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-nowrap">
        <p className="leading-[normal] whitespace-pre">Email</p>
      </div>
      <TextInput1 />
    </div>
  );
}

function Frame100() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame72 />
      <Frame73 />
    </div>
  );
}

function ContactDetailsCard() {
  return (
    <div className="bg-white relative rounded-[4px] shadow-[0px_4px_4px_0px_rgba(141,141,141,0.25)] shrink-0 w-full" data-name="Contact Details Card">
      <div className="flex flex-col justify-end size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start justify-end p-[16px] relative w-full">
          <div className="flex flex-col font-['Arya:Bold',_'Noto_Sans:Bold',_sans-serif] justify-center leading-[0] relative shrink-0 text-[18px] text-black text-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 700" }}>
            <p className="leading-[normal] whitespace-pre">Thông tin liên lạc (Hóa đơn đặt chỗ chi tiết sẽ được gửi lại qua mail)</p>
          </div>
          <Frame100 />
        </div>
      </div>
    </div>
  );
}

function Header1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[834px]" data-name="Header">
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[18px] text-black text-nowrap whitespace-pre">Thông tin hành khách</p>
    </div>
  );
}

function Component18ChevronDown1() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="18 / chevron down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="18 / chevron down">
          <path d={svgPaths.pcc7fd00} fill="var(--fill-0, #6E7491)" id="Vector 8" />
        </g>
      </svg>
    </div>
  );
}

function BasePillChit1() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0" data-name=".base / pill chit">
      <div className="box-border content-stretch flex gap-[4px] items-center overflow-clip pl-[16px] pr-[12px] py-[8px] relative rounded-[inherit]">
        <div className="flex flex-col font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] justify-center leading-[0] relative shrink-0 text-[#27273f] text-[16px] text-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
          <p className="leading-[normal] whitespace-pre">Người lớn (trên 12 tuổi)</p>
        </div>
        <Component18ChevronDown1 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#a1b0cc] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function PilllChit1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Pilll Chit">
      <BasePillChit1 />
    </div>
  );
}

function Frame84() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['Arya:Bold',_'Noto_Sans:Bold',_sans-serif] justify-center leading-[0] relative shrink-0 text-[16px] text-black text-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 700" }}>
        <p className="leading-[normal] whitespace-pre">Hành khách phổ thông</p>
      </div>
      <PilllChit1 />
    </div>
  );
}

function Divider() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Divider">
      <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 834 1">
          <g id="Divider">
            <line id="Line 1" stroke="var(--stroke-0, #C8C8C8)" x2="834" y1="0.5" y2="0.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function ExclamationCircle() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="exclamation-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="exclamation-circle">
          <path d={svgPaths.p12731d00} id="Vector" stroke="var(--stroke-0, #228BE6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Icon() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 size-[16px]" data-name="*Icon*">
      <ExclamationCircle />
    </div>
  );
}

function Icon1() {
  return (
    <div className="box-border content-stretch flex items-start px-0 py-[2px] relative shrink-0" data-name="Icon">
      <Icon />
    </div>
  );
}

function Container() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[7px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <p className="font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] leading-[normal] relative shrink-0 text-[14px] text-black w-full" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        Đề nghị nhập chính xác và đầy đủ cả họ và tên của bạn được viết trogn CCCD/ Hộ chiếu
      </p>
    </div>
  );
}

function AlertUnstyled() {
  return (
    <div className="basis-0 bg-[#e7f5ff] grow min-h-px min-w-px relative rounded-[2px] shrink-0" data-name="*Alert Unstyled*">
      <div className="size-full">
        <div className="box-border content-stretch flex gap-[16px] items-start px-[16px] py-[12px] relative w-full">
          <Icon1 />
          <Container />
        </div>
      </div>
    </div>
  );
}

function Alert1() {
  return (
    <div className="content-stretch flex items-start relative rounded-[4px] shrink-0 w-full" data-name="Alert">
      <AlertUnstyled />
    </div>
  );
}

function BaseTextInput2() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name=".base / text input">
      <div className="flex flex-row items-end overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-end px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Arya:Regular',_sans-serif] grow h-[32px] justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#7c8db0] text-[16px]">
            <p className="leading-[normal]">e.g. John Doe</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#a1b0cc] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function TextInput2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-full" data-name="Text Input">
      <BaseTextInput2 />
    </div>
  );
}

function Frame83() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] justify-center leading-[0] relative shrink-0 text-[16px] text-black text-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[normal] whitespace-pre">Họ và tên đệm</p>
      </div>
      <TextInput2 />
    </div>
  );
}

function BaseTextInput3() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name=".base / text input">
      <div className="flex flex-row items-end overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-end px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Arya:Regular',_sans-serif] grow h-[32px] justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#7c8db0] text-[16px]">
            <p className="leading-[normal]">e.g. Bobby</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#a1b0cc] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function TextInput3() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-full" data-name="Text Input">
      <BaseTextInput3 />
    </div>
  );
}

function Frame99() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col font-['Arya:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-nowrap">
        <p className="leading-[normal] whitespace-pre">Tên</p>
      </div>
      <TextInput3 />
    </div>
  );
}

function Frame79() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame83 />
      <Frame99 />
    </div>
  );
}

function Component18ChevronDown2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="18 / chevron down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="18 / chevron down">
          <path d={svgPaths.pcc7fd00} fill="var(--fill-0, #6E7491)" id="Vector 8" />
        </g>
      </svg>
    </div>
  );
}

function BasePillChit2() {
  return (
    <div className="basis-0 bg-white grow h-full min-h-px min-w-px relative rounded-[4px] shrink-0" data-name=".base / pill chit">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center pl-[16px] pr-[12px] py-[8px] relative size-full">
          <div className="flex flex-col font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] justify-center leading-[0] relative shrink-0 text-[#27273f] text-[16px] text-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
            <p className="leading-[normal] whitespace-pre">Chọn</p>
          </div>
          <Component18ChevronDown2 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#a1b0cc] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function PilllChit2() {
  return (
    <div className="content-stretch flex h-[48px] items-start relative shrink-0 w-full" data-name="Pilll Chit">
      <BasePillChit2 />
    </div>
  );
}

function Frame74() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] justify-center leading-[0] relative shrink-0 text-[16px] text-black text-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[normal] whitespace-pre">Quốc tịch</p>
      </div>
      <PilllChit2 />
    </div>
  );
}

function Component18ChevronDown3() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="18 / chevron down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="18 / chevron down">
          <path d={svgPaths.pcc7fd00} fill="var(--fill-0, #6E7491)" id="Vector 8" />
        </g>
      </svg>
    </div>
  );
}

function BasePillChit3() {
  return (
    <div className="basis-0 bg-white grow h-full min-h-px min-w-px relative rounded-[4px] shrink-0" data-name=".base / pill chit">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[4px] items-center pl-[16px] pr-[12px] py-[8px] relative size-full">
          <div className="flex flex-col font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] justify-center leading-[0] relative shrink-0 text-[#27273f] text-[16px] text-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
            <p className="leading-[normal] whitespace-pre">Chọn</p>
          </div>
          <Component18ChevronDown3 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#a1b0cc] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function PilllChit3() {
  return (
    <div className="content-stretch flex h-[48px] items-start relative shrink-0 w-full" data-name="Pilll Chit">
      <BasePillChit3 />
    </div>
  );
}

function Frame75() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] justify-center leading-[0] relative shrink-0 text-[16px] text-black text-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[normal] whitespace-pre">Giới tính</p>
      </div>
      <PilllChit3 />
    </div>
  );
}

function Frame82() {
  return (
    <div className="basis-0 content-stretch flex gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame74 />
      <Frame75 />
    </div>
  );
}

function BaseTextInput4() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name=".base / text input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="relative shrink-0 size-[16px]" data-name="Calendar">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgCalendar} />
          </div>
          <div className="basis-0 flex flex-col font-['Arya:Regular',_sans-serif] grow h-[32px] justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#7c8db0] text-[16px]">
            <p className="leading-[normal]">dd/mm/yyyy</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#a1b0cc] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function TextInput4() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-full" data-name="Text Input">
      <BaseTextInput4 />
    </div>
  );
}

function Frame76() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col font-['Arya:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-nowrap">
        <p className="leading-[normal] whitespace-pre">Ngày/ tháng / năm sinh</p>
      </div>
      <TextInput4 />
    </div>
  );
}

function Frame80() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame82 />
      <Frame76 />
    </div>
  );
}

function BaseTextInput5() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name=".base / text input">
      <div className="flex flex-row items-end overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-end px-[12px] py-[8px] relative w-full">
          <div className="basis-0 flex flex-col font-['Arya:Regular',_sans-serif] grow h-[32px] justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#7c8db0] text-[16px]">
            <p className="leading-[normal]">Passport number...</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#a1b0cc] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function TextInput5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-full" data-name="Text Input">
      <BaseTextInput5 />
    </div>
  );
}

function Frame77() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start min-h-px min-w-px relative shrink-0">
      <div className="flex flex-col font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] justify-center leading-[0] relative shrink-0 text-[16px] text-black text-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[normal] whitespace-pre">Số hộ chiếu</p>
      </div>
      <TextInput5 />
    </div>
  );
}

function BaseTextInput6() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 w-full" data-name=".base / text input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative w-full">
          <div className="relative shrink-0 size-[16px]" data-name="Calendar">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgCalendar} />
          </div>
          <div className="basis-0 flex flex-col font-['Arya:Regular',_sans-serif] grow h-[32px] justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#7c8db0] text-[16px]">
            <p className="leading-[normal]">dd/mm/yyyy</p>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#a1b0cc] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function TextInput6() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative shrink-0 w-full" data-name="Text Input">
      <BaseTextInput6 />
    </div>
  );
}

function Frame78() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] justify-center leading-[0] relative shrink-0 text-[16px] text-black text-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        <p className="leading-[normal] whitespace-pre">Ngày hết hạn</p>
      </div>
      <TextInput6 />
    </div>
  );
}

function BaseCheckbox() {
  return (
    <div className="absolute inset-0 rounded-[2px]" data-name=".base / checkbox">
      <div aria-hidden="true" className="absolute border border-[#6e7491] border-solid inset-0 pointer-events-none rounded-[2px]" />
    </div>
  );
}

function Checkbox() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Checkbox">
      <BaseCheckbox />
    </div>
  );
}

function Checkbox1() {
  return (
    <div className="box-border content-stretch flex gap-[8px] items-center px-0 py-[4px] relative shrink-0" data-name="Checkbox">
      <Checkbox />
      <div className="flex flex-col font-['Arya:Regular',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6e7491] text-[16px] text-nowrap">
        <p className="leading-[normal] whitespace-pre">No expiration</p>
      </div>
    </div>
  );
}

function Frame85() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px relative shrink-0">
      <Frame78 />
      <Checkbox1 />
    </div>
  );
}

function Frame81() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame77 />
      <Frame85 />
    </div>
  );
}

function PassengerForm() {
  return (
    <div className="content-stretch flex flex-col gap-[15px] items-start relative shrink-0 w-full" data-name="Passenger Form">
      <Frame79 />
      <Frame80 />
      <Frame81 />
    </div>
  );
}

function ExclamationCircle1() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="exclamation-circle">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="exclamation-circle">
          <path d={svgPaths.p12731d00} id="Vector" stroke="var(--stroke-0, #868E96)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Icon3() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 size-[16px]" data-name="*Icon*">
      <ExclamationCircle1 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="box-border content-stretch flex items-start px-0 py-[2px] relative shrink-0" data-name="Icon">
      <Icon3 />
    </div>
  );
}

function Title1() {
  return (
    <div className="content-stretch flex gap-[7px] items-center justify-center relative shrink-0 w-full" data-name="Title">
      <p className="basis-0 font-['Arya:Bold',_sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-black">Cabin or carry-on baggage information</p>
    </div>
  );
}

function Container1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[7px] grow items-start min-h-px min-w-px relative shrink-0" data-name="Container">
      <Title1 />
      <p className="font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] leading-[normal] relative shrink-0 text-[14px] text-black w-full" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        Được phép mang theo hành lý xách tay không quá 7 cân.
      </p>
    </div>
  );
}

function AlertUnstyled1() {
  return (
    <div className="bg-[#e9ecef] relative rounded-[4px] shrink-0 w-full" data-name="*Alert Unstyled*">
      <div className="size-full">
        <div className="box-border content-stretch flex gap-[16px] items-start px-[16px] py-[12px] relative w-full">
          <Icon4 />
          <Container1 />
        </div>
      </div>
    </div>
  );
}

function PassangerCard() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start relative rounded-[4px] shrink-0 w-full" data-name="Passanger Card">
      <Frame84 />
      <Divider />
      <Alert1 />
      <PassengerForm />
      <AlertUnstyled1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[16px]" data-name="Plus">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgPlus} />
      </div>
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0194f3] text-[16px] text-nowrap whitespace-pre">Thêm hành khách</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[10px] items-start px-[20px] py-[12px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#0194f3] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <Frame2 />
    </div>
  );
}

function Frame102() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-end relative shrink-0 w-full">
      <Button1 />
    </div>
  );
}

function Passengers() {
  return (
    <div className="bg-white box-border content-stretch flex flex-col gap-[11px] items-start overflow-clip p-[16px] relative rounded-[4px] shadow-[0px_4px_4px_0px_rgba(141,141,141,0.25)] shrink-0" data-name="Passengers">
      <Header1 />
      <PassangerCard />
      <Frame102 />
    </div>
  );
}

function Header2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Header">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex items-center justify-between p-[10px] relative w-full">
          <p className="font-['Arya:Bold',_'Noto_Sans:Bold',_sans-serif] leading-[normal] relative shrink-0 text-[18px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 700" }}>
            Chính sách hoàn trả/ hủy/ đổi vé
          </p>
          <div className="relative shrink-0 size-[18px]" data-name="Expand Arrow">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgExpandArrow} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Body1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Body">
      <div className="size-full">
        <div className="box-border content-stretch flex gap-[10px] items-start p-[10px] relative w-full">
          <div className="basis-0 font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] grow leading-[0] min-h-px min-w-px relative shrink-0 text-[14px] text-black" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
            <p className="leading-[normal] mb-0">Tại GlobGoer, chúng tôi hiểu rằng kế hoạch có thể thay đổi bất ngờ. Chúng tôi cố gắng cung cấp chính sách hủy và hoàn tiền linh hoạt và thân thiện với khách hàng đối với việc đặt vé máy bay. Vui lòng xem lại chi tiết chính sách sau:</p>
            <p className="leading-[normal] mb-0">&nbsp;</p>
            <ol className="list-decimal mb-0" start="1">
              <li className="ms-[21px]">
                <span className="leading-[normal]">Yêu câu hủy bỏ:</span>
              </li>
            </ol>
            <ul className="list-disc">
              <li className="mb-0 ms-[21px]">
                <span className="leading-[normal]">Tất cả các yêu cầu hủy phải được gửi qua trang web của chúng tôi hoặc bằng cách liên hệ với nhóm hỗ trợ khách hàng của chúng tôi.</span>
              </li>
              <li className="ms-[21px]">
                <span className="leading-[normal]">Yêu cầu hủy được thực hiện thông qua trang web của chúng tôi phải được thực hiện bằng cách truy cập đặt chỗ của bạn và làm theo quy trình hủy..</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-start px-[16px] py-[8px] relative rounded-[4px] shrink-0" data-name="Button">
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#482a89] text-[14px] text-nowrap whitespace-pre">Read more</p>
    </div>
  );
}

function CancellationPolicy() {
  return (
    <div className="bg-white relative rounded-[4px] shadow-[0px_4px_4px_0px_rgba(141,141,141,0.25)] shrink-0 w-full" data-name="Cancellation Policy">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full">
          <Header2 />
          <Body1 />
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[12px] relative rounded-[4px] shrink-0" data-name="Button">
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[#482a89] text-[18px] text-nowrap whitespace-pre">Cancel</p>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#5d36af] box-border content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[12px] relative rounded-[4px] shrink-0" data-name="Button">
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[18px] text-nowrap text-white whitespace-pre">Proceed to Payment</p>
    </div>
  );
}

function Frame104() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Button3 />
      <Button4 />
    </div>
  );
}

function Main() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[32px] items-end left-[calc(11.111%-7px)] top-[194px]" data-name="Main">
      <p className="font-['Arya:Bold',_'Noto_Sans:Bold',_sans-serif] leading-[normal] relative shrink-0 text-[32px] text-black text-center text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 700" }}>
        Nhập thông tin đặt chỗ
      </p>
      <TripHeader />
      <TripSummary />
      <ImportantGuidelines />
      <ContactDetailsCard />
      <Passengers />
      <CancellationPolicy />
      <Frame104 />
    </div>
  );
}

function Frame103() {
  return (
    <div className="content-stretch flex gap-[8px] items-start leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-center text-nowrap whitespace-pre">
      <p className="font-['Arya:Bold',_sans-serif] relative shrink-0">Flight Summary</p>
      <p className="font-['Arya:Regular',_sans-serif] relative shrink-0">-</p>
      <p className="font-['Arya:Bold',_sans-serif] relative shrink-0">Important Guidelines</p>
      <p className="font-['Arya:Regular',_sans-serif] relative shrink-0">-</p>
      <p className="font-['Arya:Bold',_sans-serif] relative shrink-0">Contact Details</p>
      <p className="font-['Arya:Regular',_sans-serif] relative shrink-0">-</p>
      <p className="font-['Arya:Bold',_sans-serif] relative shrink-0">Passengers</p>
      <p className="font-['Arya:Regular',_sans-serif] relative shrink-0">-</p>
      <p className="font-['Arya:Bold',_sans-serif] relative shrink-0">Cancellation Policy</p>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[calc(11.111%-10px)] top-[115px] w-[1228px]" data-name="Page Header">
      <p className="font-['Arya:Bold',_'Noto_Sans:Bold',_sans-serif] leading-[normal] relative shrink-0 text-[18px] text-black text-center text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 700" }}>
        Hãy hoàn tất việc đặt chỗ
      </p>
      <Frame103 />
    </div>
  );
}

function Frame95() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
      <div className="relative shrink-0 size-[16px]" data-name="Expand Arrow">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgExpandArrow} />
      </div>
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">Base fare</p>
    </div>
  );
}

function Frame86() {
  return (
    <div className="content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap w-full whitespace-pre">
      <p className="font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] relative shrink-0" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        Người lớn (1 x $110)
      </p>
      <p className="font-['Arya:Regular',_sans-serif] not-italic relative shrink-0">$110</p>
    </div>
  );
}

function Frame87() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame95 />
      <Frame86 />
    </div>
  );
}

function Divider1() {
  return (
    <div className="h-0 relative shrink-0 w-full" data-name="Divider">
      <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 301 1">
          <g id="Divider">
            <line id="Line 1" stroke="var(--stroke-0, #C8C8C8)" x2="301" y1="0.5" y2="0.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame96() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0">
      <div className="relative shrink-0 size-[16px]" data-name="Expand Arrow">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgExpandArrow} />
      </div>
      <p className="font-['Arya:Bold',_'Noto_Sans:Bold',_sans-serif] leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 700" }}>
        Phụ phí, thuế và thủ tục
      </p>
    </div>
  );
}

function Frame88() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame96 />
      <p className="font-['Arya:Bold',_sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-black text-nowrap whitespace-pre">$23</p>
    </div>
  );
}

function Frame89() {
  return (
    <div className="content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap w-full whitespace-pre">
      <p className="font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] relative shrink-0" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        Thuế thủ tục
      </p>
      <p className="font-['Arya:Regular',_sans-serif] not-italic relative shrink-0">$17.3</p>
    </div>
  );
}

function Frame90() {
  return (
    <div className="content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap w-full whitespace-pre">
      <p className="font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] relative shrink-0" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        Phí dịch vụ
      </p>
      <p className="font-['Arya:Regular',_sans-serif] not-italic relative shrink-0">$6</p>
    </div>
  );
}

function Frame93() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame88 />
      <Frame89 />
      <Frame90 />
    </div>
  );
}

function Frame97() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 size-[16px]" data-name="Expand Arrow">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-contain pointer-events-none size-full" src={imgExpandArrow} />
      </div>
      <p className="font-['Arya:Bold',_'Noto_Sans:Bold',_sans-serif] leading-[normal] relative shrink-0 text-[14px] text-black w-[301px]" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 700" }}>
        Dịch vụ khác
      </p>
    </div>
  );
}

function Frame91() {
  return (
    <div className="content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[14px] text-black text-nowrap w-full whitespace-pre">
      <p className="font-['Arya:Regular',_'Noto_Sans:Regular',_sans-serif] relative shrink-0" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        Từ thiện
      </p>
      <p className="font-['Arya:Regular',_sans-serif] not-italic relative shrink-0">$5</p>
    </div>
  );
}

function Frame92() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame97 />
      <Frame91 />
    </div>
  );
}

function Frame94() {
  return (
    <div className="content-stretch flex items-start justify-between leading-[normal] relative shrink-0 text-[18px] text-black text-nowrap w-full whitespace-pre">
      <p className="font-['Arya:Bold',_'Noto_Sans:Bold',_sans-serif] relative shrink-0" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 700" }}>
        Tổng hóa đơn
      </p>
      <p className="font-['Arya:Bold',_sans-serif] not-italic relative shrink-0">$139</p>
    </div>
  );
}

function FareSummaryCard() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[16px] items-start left-[calc(66.667%+85px)] p-[16px] rounded-[4px] shadow-[0px_4px_4px_0px_rgba(141,141,141,0.25)] top-[187px] w-[333px]" data-name="Fare Summary Card">
      <p className="font-['Arya:Bold',_'Noto_Sans:Bold',_sans-serif] leading-[normal] relative shrink-0 text-[18px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 700" }}>
        Hóa đơn tạm tính
      </p>
      <Frame87 />
      <Divider1 />
      <Frame93 />
      <Divider1 />
      <Frame92 />
      <Divider1 />
      <Frame94 />
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
    <div className="absolute bg-[#153a43] box-border content-stretch flex flex-col gap-[17px] items-start left-0 px-0 py-[16px] top-[2417px] w-[1440px]" data-name="Desktop Footer">
      <FooterContent />
      <FooterDivider />
      <Bottom />
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

function Frame119() {
  return (
    <div className="absolute bg-[#0194f3] h-[113px] left-0 top-0 w-[1440px]">
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

export default function EnterBookingDetails() {
  return (
    <div className="bg-white relative size-full" data-name="Enter booking details">
      <Main />
      <PageHeader />
      <FareSummaryCard />
      <DesktopFooter />
      <Frame119 />
    </div>
  );
}