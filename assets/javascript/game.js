var game = {
  player_character: null,
  opponent_character: null,
  available_characters: [character_one, character_two, character_three, character_four, character_five],

  setPlayerCharacter: function(character){
    if(isInArray(character, game.available_characters)){
      game.player_character = character;
      removeItemFromArray(character, this.available_characters);
      $('#player_character').text(character.hp);
      game.moveCharacter(character, "attacker");
      game.updateCharacterDisplay();
    }
  },

  setOpponentCharacter: function(character){
    if(isInArray(character, game.available_characters)){
      game.opponent_character = character;
      removeItemFromArray(character, this.available_characters);
      $('#player_character').text(character.hp);
      game.moveCharacter(character, "defender");
    }
  },

  updateCharacterDisplay: function(){
    //add available characters to top
    var allcharacters = $(".charholder");
    var characterspace;
    allcharacters.empty();
    for(var i=0;i<game.available_characters.length;i++){
      characterspace = game.createCharacterStats(game.available_characters[i]);
      allcharacters.append(characterspace);
    }
    //add attacker
    var characterstats;
    if(this.player_character){
      moveCharacter(this.player_character, "attacker");
    }
    //add defender
    if(opponent_character){
      moveCharacter(this.opponent_character, "defender");
    }
  },

  createCharacterStats:function(character){
    charactername = character.name;
    characterhp = character.hp;
    characterattack = character.attack;
    return '<div class="characterspace">' +
                  '<p class="charactertext charactername">'+charactername+'</p>' +
                  '<p class="charactertext characterhp">'+characterhp+'</p>' +
                  '<p class="charactertext characterattack">'+characterattack+'</p>' +
               '</div>';
  },

  resetCharacters: function(){
    //make all characters available again
    game.available_characters = [character_one, character_two, character_three, character_four, character_five];
    $("#attacker").empty();
    $("#defender").empty();
    game.updateCharacterDisplay();
  },

  moveCharacter: function(character){
    //move a character to the attacking or defending position
    var characterstats = game.createCharacterStats(character);
    $("#"+position).append(characterstats);
  }
};


function removeItemFromArray(item, array){
    return array.splice($.inArray(item, array),1);
}

function isInArray(item, array){
  if(array.indexOf(item)>=0){
    return true;
  }
  else{
    return false;
  }
}
