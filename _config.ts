import lume from "lume/mod.ts";

const site = lume({
  location: new URL("https://heatray.github.io/racenet/"),
});

site.data("baseurl", "https://heatray.github.io/racenet/");
site.data("racenet_menu", "simple");

site.copy("_static", ".");

site.ignore(
  "racenetlegacy.codemasters.com/Content/Showdown/Flash/careerPage1/discipline_results.swf",
  "racenetlegacy.codemasters.com/Content/Showdown/Flash/careerPage1/extra_info.swf",
  "racenetlegacy.codemasters.com/Content/Showdown/Flash/careerPage1/high_scores.swf",
  "racenetlegacy.codemasters.com/Content/Showdown/Flash/careerPage1/recent_results.swf",
  "racenetlegacy.codemasters.com/Content/Showdown/Flash/careerPage1/results_overview.swf",
  "racenetlegacy.codemasters.com/Content/Showdown/Flash/joyride/joyride.swf",
  "racenetlegacy.codemasters.com/Content/css/Compatibility.css",
  "racenetlegacy.codemasters.com/Content/css/layout-single.css",
  "racenetlegacy.codemasters.com/Content/css/Grid2Home.css",
  "racenetlegacy.codemasters.com/Content/css/Grid2Refresh.css",
  "racenetlegacy.codemasters.com/Content/scripts/CareerOverview.js",
  "racenetlegacy.codemasters.com/Content/scripts/TripleBarCarStatsScript.js",
  "racenetlegacy.codemasters.com/Content/scripts/joyride.js"
);
site.ignore("dirt4.dirtgame.com")
site.ignore("ecdn.codemasters.com")

site.copy("racenetlegacy.codemasters.com", ".");

export default site;
