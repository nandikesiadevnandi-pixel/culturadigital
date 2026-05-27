export function CopaBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base deep blue */}
      <div className="absolute inset-0 bg-[#0E3A7A]" />

      {/* Red block — top left */}
      <div className="absolute -top-16 -left-16 w-[52%] h-[44%] bg-[#D43B2A] rounded-br-[120px] rounded-tr-[50px]" />
      {/* Light blue accent — top center */}
      <div className="absolute -top-8 left-[38%] w-[20%] h-[20%] bg-[#38BDF8] rounded-b-[70px] opacity-90" />
      {/* Green block — top right */}
      <div className="absolute -top-12 right-0 w-[28%] h-[38%] bg-[#1E9B5F] rounded-bl-[90px]" />

      {/* Yellow block — left middle */}
      <div className="absolute top-[38%] -left-8 w-[24%] h-[26%] bg-[#FBBA16] rounded-r-[70px]" />
      {/* Purple block — center */}
      <div className="absolute top-[32%] left-[20%] w-[32%] h-[26%] bg-[#6B21A8] rounded-[55px] opacity-80" />
      {/* Teal block — right middle */}
      <div className="absolute top-[30%] right-0 w-[26%] h-[32%] bg-[#00B4D8] rounded-l-[80px]" />

      {/* Orange block — bottom left */}
      <div className="absolute bottom-0 -left-8 w-[40%] h-[38%] bg-[#E57200] rounded-tr-[90px]" />
      {/* Magenta accent — bottom center */}
      <div className="absolute bottom-[6%] left-[33%] w-[20%] h-[22%] bg-[#DB2777] rounded-[45px] opacity-85" />
      {/* Green block — bottom right */}
      <div className="absolute bottom-0 right-0 w-[44%] h-[42%] bg-[#059669] rounded-tl-[100px]" />

      {/* Depth overlay */}
      <div className="absolute inset-0 bg-[#0E3A7A]/30" />
    </div>
  );
}
