import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";

export function TestimonialAuthor() {
  return (
    <div className="flex items-center gap-4 pt-10">
      <AvatarGroup>
        <Avatar className="size-12">
          <AvatarImage src="/expa-logo.png" alt="Expa" />
          <AvatarFallback>EX</AvatarFallback>
        </Avatar>
        <Avatar className="size-12">
          <AvatarImage src="/vitor-lourenco.png" alt="Vitor Lourenço" />
          <AvatarFallback>VL</AvatarFallback>
        </Avatar>
      </AvatarGroup>
      <div className="flex flex-col">
        <span className="text-[0.95em] font-medium leading-tight text-gray-900">
          Vitor Lourenço
        </span>
        <span className="text-[0.85em] font-normal leading-tight text-gray-500">
          Head of Design at Expa
        </span>
      </div>
    </div>
  );
}
