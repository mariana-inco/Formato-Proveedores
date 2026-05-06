import type { NextConfig } from "next";

const configuracionDelProyecto: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
};

export default configuracionDelProyecto;
