// Uses the same styles as Product
import PageNav from "../components/PageNav";
import styles from "./Pricing.module.css";

export default function Product() {
  return (
    <main className={styles.pricing}>
      <PageNav />
      <section>
        <div>
          <h2>
            Simple pricing.
            <br />
            Just $9/month.
          </h2>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae vel
            labore mollitia iusto. Recusandae quos provident, laboriosam fugit
            voluptatem iste.
          </p>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae
            exercitationem in optio reiciendis, nobis voluptas corporis mollitia
            ut distinctio ad pariatur commodi maxime porro labore accusantium.
            Nesciunt in eum deserunt!.
          </p>
        </div>

        {/* <img src="img-2.jpg" alt="overview of a large city with skyscrapers" /> */}
      </section>
    </main>
  );
}
