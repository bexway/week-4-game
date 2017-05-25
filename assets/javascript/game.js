var game = {
  attacker_character: null,
  defender_character: null,
  available_characters: [character_one, character_two, character_three, character_four, character_five],
  gamestate: 0,
  //0 is waiting for attacker choice, 1 is waiting for opponent choice, 2 is battle

  setAttacker: function(character){
    // if(this.gamestate<1){
      if(isInArray(character, game.available_characters)&&!game.attacker_character){
        game.attacker_character = character;
        removeItemFromArray(character, this.available_characters);
        // $('#attacker_character').text(character.hp);
        game.updateFighter(character, "attacker");
        game.updateCharacterDisplay();
      }
      else{
        console.log("error");
      // }
    }
  },

  setDefender: function(character){
    if(isInArray(character, game.available_characters)&&!game.defender_character){
      game.defender_character = character;
      removeItemFromArray(character, this.available_characters);
      // $('#defender_character').text(character.hp);
      game.updateFighter(character, "defender");
      game.updateCharacterDisplay();
    }
    else{
      console.log("error");
    }
  },

  updateCharacterDisplay: function(){
    //add available characters to top
    var allcharacters = $(".charholder");
    var characterstatblock;
    allcharacters.empty();
    for(var i=0;i<game.available_characters.length;i++){
      characterstatblock = game.createCharacterStats(game.available_characters[i]);
      characterstatblock.addClass("available");
      allcharacters.append(characterstatblock);
      // console.log(characterstatblock.data());
    }
  },

  createCharacterStats:function(character){
    var charactername = character.name;
    var charactermaxhp = character.maxhp;
    var charactercurrenthp = character.currenthp;
    var characterattack = character.currentattack;
    // return '<div class="characterstatblock" id="'+charactername+'">' +
    //               '<p class="charactertext charactername">'+charactername+'</p>' +
    //               '<p class="charactertext charactermaxhp">'+charactermaxhp+'</p>' +
    //               '<p class="charactertext charactercurrenthp">'+charactercurrenthp+'</p>' +
    //               '<p class="charactertext characterattack">'+characterattack+'</p>' +
    //            '</div>';
    var jqcharacter = $('<div>').addClass("characterstatblock").attr("id", charactername).data("charactervar", character);
    var stats = '<p class="charactertext charactername">'+charactername+'</p>' +
    '<p class="charactertext charactermaxhp">'+charactermaxhp+'</p>' +
    '<p class="charactertext charactercurrenthp">'+charactercurrenthp+'</p>' +
    '<p class="charactertext characterattack">'+characterattack+'</p>';
    jqcharacter.append(stats);
    return jqcharacter;

  },

  resetCharacters: function(){
    //make all characters available again
    game.available_characters = [character_one, character_two, character_three, character_four, character_five];
    //clear attacker and defender
    $("#attacker").empty();
    $("#defender").empty();
    game.attacker_character = null;
    game.defender_character = null;
    //restore health and attack
    for(var i=0;i<game.available_characters.length;i++){
      game.available_characters[i].currenthp = game.available_characters[i].maxhp;
      game.available_characters[i].currentattack = game.available_characters[i].maxattack;
    }
    game.updateCharacterDisplay();
  },

  updateFighter: function(character, position){
    //update fighter stats or position
    var characterstats = game.createCharacterStats(character);
    $("#"+position).html(characterstats);
  },

  // takeTurn: function(){
  //   //Run this when the attack button is clicked
  //   //First, the attacker makes their move
  //   this.makeAttack();
  //   //if the defender is dead, remove them from play and check if the game is over. They don't counterattack since they're dead
  //   if(this.checkIfDead(this.defender_character)){
  //     this.removeDefender();
  //   }
  //   //Otherwise, make a counterattack, and check if the attacker is dead
  //   else{
  //     this.counterAttack();
  //     if(this.checkIfDead(this.attacker_character)){
  //       console.log("test");
  //     }
  //   }
  // },
  takeTurn: function(){
    //Run this when the attack button is clicked
    //First, the attacker makes their move
    console.log("Attack");
    this.makeAttack();
    //if the defender is dead, remove them from play and check if the game is over. They don't counterattack since they're dead
    if(!this.checkIfDead(this.defender_character)){
      console.log("counter");
      this.counterAttack();
    }
  },

  makeAttack: function(){
    this.defender_character.currenthp -= this.attacker_character.currentattack;
    this.attacker_character.currentattack += 6;
    // console.log(this.defender_character.currenthp)
    this.updateFighter(this.defender_character, "defender");
    this.updateFighter(this.attacker_character, "attacker");
  },

  counterAttack: function(){
    this.attacker_character.currenthp -= this.defender_character.counter;
    this.updateFighter(this.attacker_character, "attackers");
    this.updateFighter(this.defender_character, "defender");
  },

  checkIfDead: function(character){
    if(character.currenthp <= 0){
      return true;
    }
    else{
      return false;
    }
  },

  removeAttacker: function(){
    $("#attacker").empty();
    game.attacker_character = null;
  },

  removeDefender: function(){
    $("#defender").empty();
    game.defender_character = null;
  },

  checkIfGameOver: function(){
    if((!game.defender_character&&game.available_characters.length===0)){
      return true;
    }
    else if(!game.attacker_character){
      return true;
    }
    else{
      return false;
    }
    //remove attack button, add startgame button
  },

  startGame: function(){
    this.resetCharacters();
    this.gamestate = 0;
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

//since the character stat blocks are dynamic, the onclick is set up attached to the document
$(document).on('click', '.available', function(){
  //set attacker or defender, whichever needs to be set
    if(!game.attacker_character){
      game.setAttacker($(this).data("charactervar"));
    }
    else if(!game.defender_character){
      game.setDefender($(this).data("charactervar"));
      $('.attackbtn').toggle();
    }
  });

$('.attackbtn').click(function(){
  game.takeTurn();
  if(game.checkIfDead(game.attacker_character)){
    $('.attackbtn').toggle();
    game.removeAttacker();
  }
  else if(game.checkIfDead(game.defender_character)){
    $('.attackbtn').toggle();
    game.removeDefender();
  }
  if(game.checkIfGameOver()){
    $('.resetbtn').toggle();
  }
});

$('.resetbtn').click(function(){
  game.startGame();
  $('.resetbtn').toggle();
});


//Below: TESTING SETUP code
game.startGame();

// game.setAttacker(character_two);
// game.setDefender(character_five);
