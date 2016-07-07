import firebase from 'firebase';

const refs = {
  root() {
    return firebase.database().ref();
  },
  user() {
    return this.root().child('users').child(firebase.auth().currentUser.uid);
  },
};

const actions = {
  setCollected(index, collected) {
    return () => {
      refs.user().child(`pokedex/pokemons/${index}/collected`).set(collected);
    };
  },
  setTag(index, tag) {
    return () => {
      refs.user().child(`pokedex/pokemons/${index}/tag`).set(tag);
    };
  },
  setSettingsPublic(isPublic) {
    return () => {
      refs.user().child('pokedex/settings/public').set(isPublic);

      if (isPublic) {
        refs.root().child(`public_pokedex_lookup/${firebase.auth().currentUser.uid}`).set(true);
      } else {
        refs.root().child(`public_pokedex_lookup/${firebase.auth().currentUser.uid}`).remove();
      }
    };
  },
  setSettingsUsername(username) {
    return () => {
      refs.user().child('pokedex/settings/username').set(username);
      refs.root().child('usernames').child(firebase.auth().currentUser.uid).set(username);
    };
  },
  setSettingsTagTitle(tag, title) {
    return () => {
      refs.user().child(`pokedex/settings/tags/${tag}/title`).set(title);
    };
  },
};

export default actions;