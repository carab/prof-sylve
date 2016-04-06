'use strict';

import React from 'react';

import FirebaseUtils from '../../utils/firebase-utils';

import ListItem from 'material-ui/lib/lists/list-item';

require('styles/list/Pokemon.css');

class PokemonComponent extends React.Component {
  render() {
    return (
      <ListItem
        primaryText={this.props.pokemon.name}
      />
    );
  }
}

PokemonComponent.displayName = 'ListPokemonComponent';

export default PokemonComponent;
