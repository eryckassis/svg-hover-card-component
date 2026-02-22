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
        <Avatar className="size-15">
          <AvatarImage src="/perfil.jpg" alt="Expa" />
          <AvatarFallback>EX</AvatarFallback>
        </Avatar>
        <Avatar className="size-15">
          <AvatarImage src="/perfil.jpg" alt="Vitor Lourenço" />
          <AvatarFallback>VL</AvatarFallback>
        </Avatar>
      </AvatarGroup>
      <div className="flex flex-col">
        <span className="text-[0.95em] font-neuemontreal font-light leading-tight text-gray-500">
          Eric Assis
        </span>
        <span className="text-[0.85em] font-neuemontreal font-light leading-tight text-gray-500">
          Head of Design at Nordic Studio.
        </span>
      </div>
    </div>
  );
}
