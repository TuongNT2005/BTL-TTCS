import Container from "./Container";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-violet-100 bg-white py-12">
      <Container>
        <div className="grid gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <div className="text-3xl font-black text-violet-700">TGSHOP</div>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour, or randomised words which don't look even
              slightly believable.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-700 md:justify-end">
            {[
              "Hỏi đáp",
              "Chính sách",
              "Điều khoản",
              "Giới thiệu",
              "Liên hệ",
            ].map((item) => (
              <a key={item} href="#" className="hover:text-violet-700">
                {item}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}