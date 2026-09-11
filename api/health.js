export default function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  res.status(200).json({
    status: 'ok',
    game: 'Minecraft1 Voxel Sandbox',
    runtime: 'Vercel Serverless Function',
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
    timestamp: new Date().toISOString()
  });
}
