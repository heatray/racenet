import lume from "lume/mod.ts";

const site = lume();

site.copy("_static", ".");
site.copy("racenetlegacy.codemasters.com", ".");

export default site;
