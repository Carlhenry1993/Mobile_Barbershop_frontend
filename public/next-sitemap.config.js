/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.mrrenaudinbarbershop.com',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/login'], // Ne pas indexer les pages privées
};
