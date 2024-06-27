/**
 * Middleware pour gérer les erreurs asynchrones dans les fonctions de route Express.
 * 
 * @param {Function} theFunction - La fonction de route asynchrone à wrapper.
 * @returns {Function} Une nouvelle fonction qui gère les erreurs asynchrones.
 */
module.exports = (theFunction) => {
  return (req, res, next) => {
    Promise.resolve(theFunction(req, res, next))
      .catch((error) => {
        console.error('Erreur asynchrone interceptée:', error);
        next(error);
      });
  };
};