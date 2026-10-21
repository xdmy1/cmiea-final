import { sitePath } from "@/lib/site-path";
// This card keeps the original content, desktop/mobile layouts and classes.
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
          <a
            href={sitePath("/despre/")}
            className="bg-main dark:bg-maindark text-white px-5 py-2 rounded-xl w-[200px]"
          >
            Află mai multe
          </a>
        </div>
        <div className="hidden lg:flex text-center gap-4 items-center justify-between items-start">
          <div className="flex flex-col justify-between text-start h-full max-w-[450px] gap-4">
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
              className="bg-main dark:bg-maindark text-lg text-white px-5 py-2 rounded-xl w-[200px] mt-6 text-center"
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
