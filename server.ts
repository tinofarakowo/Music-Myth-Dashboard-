import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get("/api/dashboard-data", (req, res) => {
    // Data for the three artists
    const data = {
      chappellRoan: {
        labels: ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        points: [5, 6, 8, 12, 11, 10, 15, 12, 20, 45, 1000],
        milestones: {
          "2014": "Signed to Atlantic Records at 17",
          "2017": "Released 'School Nights' EP",
          "2020": "Released 'Pink Pony Club' - dropped by label shortly after",
          "2021": "Becomes independent, moves back to Missouri",
          "2023": "Released debut album 'The Rise and Fall of a Midwest Princess'",
          "2024": "Global explosion with 'Good Luck, Babe!' and Coachella performance"
        }
      },
      sabrinaCarpenter: {
        labels: ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
        releases: [4, 6, 8, 10, 9, 12, 11, 14, 15, 18, 25],
        milestones: {
          "2014": "Disney Channel debut (Girl Meets World)",
          "2015": "Debut studio album 'Eyes Wide Open'",
          "2016": "'Evolution' released",
          "2019": "Singular: Act II released",
          "2022": "Signed with Island Records, 'Emails I Can't Send'",
          "2024": "'Espresso' and 'Please Please Please' dominate global charts"
        }
      },
      lizzo: {
        labels: ["Sept 2017", "Jan 2018", "May 2018", "Sept 2018", "Jan 2019", "Apr 2019", "Sept 2019"],
        popularity: [2, 2, 3, 2, 5, 20, 100],
        milestones: {
          "Sept 2017": "Truth Hurts released to minimal initial impact",
          "Jan 2018": "Song remains dormant in the indie/underground",
          "Apr 2019": "Featured in Netflix movie 'Someone Great', sparking viral TikTok use",
          "Sept 2019": "Hits #1 on Billboard Hot 100, two years after release"
        }
      }
    };
    res.json(data);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
