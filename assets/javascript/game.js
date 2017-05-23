var game = {
  attacker_character: null,
  defender_character: null,
  available_characters: [character_one, character_two, character_three, character_four, character_five],
  gamestate: 0,
  //0 is waiting for attacker choice, 1 is waiting for opponent choice, 2 is battle

  setAttacker: function(character){
    if(isInArray(character, game.available_characters)&&!game.attacker_character){
      game.attacker_character = character;
      removeItemFromArray(character, this.available_characters);
      // $('#attacker_character').text(character.hp);
      game.moveCharacter(character, "attacker");
      game.updateCharacterDisplay();
    }
    else{
      console.log("error");
    }
  },

  setDefender: function(character){
    if(isInArray(character, game.available_characters)&&!game.defender_character){
      game.defender_character = character;
      removeItemFromArray(character, this.available_characters);
      // $('#defender_character').text(character.hp);
      game.moveCharacter(character, "defender");
      game.updateCharacterDisplay();
    }
    else{
      console.log("error");
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
  },

  createCharacterStats:function(character){
    charactername = character.name;
    charactermaxhp = character.maxhp;
    charactercurrenthp = character.currenthp;
    characterattack = character.attack;
    return '<div class="characterspace">' +
                  '<p class="charactertext charactername">'+charactername+'</p>' +
                  '<p class="charactertext charactermaxhp">'+charactermaxhp+'</p>' +
                  '<p class="charactertext charactercurrenthp">'+charactercurrenthp+'</p>' +
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

  moveCharacter: function(character, position){
    //move a character to the attacking or defending position
    var characterstats = game.createCharacterStats(character);
    $("#"+position).append(characterstats);
  },

  makeAttack: function(){
    this.defender_character.currenthp -= this.attacker_character.attack;
    // console.log(this.defender_character.currenthp)
    this.checkIfDead(this.defender_character);
  },

  counterAttack: function(){
    this.attacker_character.currenthp -= this.defender_character.counter;
    this.checkIfDead(this.attacker_character);
  },

  checkIfDead: function(character){
    if(character.currenthp <= 0){
      console.log("Dead!");
    }
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
