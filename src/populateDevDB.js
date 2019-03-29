// just need some data in the database
import HomeModel from './components/main/home.model';


export const popuationOfDevelopmentDataBase = function() {
    let phrases = [
      "Howdy!",
      "Great day to be alive!",
      "I <3 JavaScript!",
      "No MongoDB FontAwesome logo...",
      "Paid an artist for the logo",
      "Need to write some tests",
      "Half of life is learning who you are.",
      "Last season of Game of Thrones...",
      "I am very over SQL",
      "Refactoring is more fun than starting from scratch",
      "Google > Apple > Amazon. But iPhone over everything",
      "These are not from a database... yet.",
      "I refuse to go back to not liking who I was"
    ];



    const phraseCollectionQuery = HomeModel.find();
    phraseCollectionQuery.exec((err,phrasesFromDB) => {
      if(err) throw err;
      if(phrasesFromDB.length===0){
        phraseFunction();
      } else {
        console.log('phrases already exists in DB');
      }
    });

    const phraseFunction = () => {
      phrases.forEach((singlePhrase) => {
        let newSinglePhrase = new HomeModel({human_sentence:singlePhrase});
        newSinglePhrase.save((err,phraseBackFromDB) => {
          if(err) throw err;
          else console.log(`phrase ${phrases.indexOf(singlePhrase)} of ${phrases.length}`);
        });
      });
    };


};
