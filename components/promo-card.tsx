import { sitePath } from "@/lib/site-path";
// Keep the original content and desktop/mobile layouts with shared site buttons.
export function PromoCard() {
  return (
    <section className="app-container mt-12 dark:text-white">
      <div className="bg-white dark:bg-dark2 p-10 rounded-2xl">
        <div className="text-center flex flex-col gap-4 items-center lg:hidden">
          <p className="font-medium text-xl">
            Un pas către{" "}
            <span className="text-main dark:text-maindark">viitorul</span> tău
            începe aici
          </p>
          <img
            src={sitePath("/assets/image-more.png")}
            className="rounded-xl"
            alt=""
          />
          <p className="text-sur text-sm">
            Un pas mai aproape de viitorul tău. Educația corectă, oportunitățile
            potrivite.
          </p>
          <a href={sitePath("/despre/")} className="app-button">
            Află mai multe
          </a>
        </div>
        <div className="hidden lg:flex gap-10 items-center justify-between">
          <div className="flex flex-col text-start max-w-[450px] gap-4">
            <p className="font-semibold text-5xl">
              Un pas către <span className="text-main">viitorul</span> tău
              începe aici
            </p>
            <p className="text-sur text-xl">
              Un pas mai aproape de viitorul tău. Educația corectă,
              oportunitățile potrivite.
            </p>
            <a
              href={sitePath("/despre/")}
              className="app-button mt-6 self-start"
            >
              Află mai multe
            </a>
          </div>
          <img
            src={sitePath("/assets/image-more.png")}
            className="rounded-xl w-[400px]"
            alt="imagine-principala"
          />
        </div>
      </div>
    </section>
  );
}
