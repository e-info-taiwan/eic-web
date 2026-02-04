const postsCount = 50
const categoriesCount = 10
const sectionsCount = 6
const topicsCount = 5
const tagsCount = 20
const homepagePicksCount = 6
const donationsCount = 3

export const Query = {
  posts: () => [...new Array(postsCount)],
  postsCount: () => postsCount,
  categories: () => [...new Array(categoriesCount)],
  categoriesCount: () => categoriesCount,
  sections: () => [...new Array(sectionsCount)],
  sectionsCount: () => sectionsCount,
  topics: () => [...new Array(topicsCount)],
  topicsCount: () => topicsCount,
  tags: () => [...new Array(tagsCount)],
  tagsCount: () => tagsCount,
  homepagePicks: () => [...new Array(homepagePicksCount)],
  homepagePicksCount: () => homepagePicksCount,
  donations: () => [...new Array(donationsCount)],
  donationsCount: () => donationsCount,
  authors: () => [...new Array(10)],
  authorsCount: () => 10,
}
