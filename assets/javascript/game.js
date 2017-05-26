var game = {
  attacker_character: null,
  defender_character: null,
  available_characters: [character_one, character_two, character_three, character_four, character_five],

  setAttacker: function(character){
      if(isInArray(character, game.available_characters)&&!game.attacker_character){
        game.attacker_character = character;
        removeItemFromArray(character, this.available_characters);
        game.updateFighter(character, "attacker");
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
    }
  },

  createCharacterStats:function(character){
    var attack;
    if(character===game.defender_character){
      attack = '<p class="charactertext characterattack">Counter-Attack Power: '+character.counter+'</p>';
    }
    else{
      attack = '<p class="charactertext characterattack">Attack Power: '+character.currentattack+'</p>';
    }
    var jqcharacter = $('<div>').addClass("characterstatblock").attr("id", character.name).data("charactervar", character);
    var stats = '<img class="characterimage" src="'+character.image+'" alt="">'+
    '<p class="charactertext charactername textalign-center">'+character.name+'</p>' +
    '<p class="charactertext characterhp">HP: '+character.currenthp+'/'+character.maxhp+'</p>' +
    attack;
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

  takeTurn: function(){
    var message = "";
    //First, the attacker makes their move
    message += this.makeAttack();
    //if the defender is dead, remove them from play and check if the game is over. They don't counterattack since they're dead
    if(!this.checkIfDead(this.defender_character)){
      message += this.counterAttack();
    }

    return message;
  },

  makeAttack: function(){
    this.defender_character.currenthp -= this.attacker_character.currentattack;
    this.attacker_character.currentattack += 6;
    // console.log(this.defender_character.currenthp)
    this.updateFighter(this.defender_character, "defender");
    this.updateFighter(this.attacker_character, "attacker");
    return "<p>You dealt "+(this.attacker_character.currentattack - 6)+" damage!</p>";
  },

  counterAttack: function(){
    this.attacker_character.currenthp -= this.defender_character.counter;
    this.updateFighter(this.attacker_character, "attacker");
    this.updateFighter(this.defender_character, "defender");
    return "<p>You took "+this.defender_character.counter+" damage! Ouch!</p>";
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
    else{
      return false;
    }
  },

  startGame: function(){
    this.resetCharacters();
    this.gamestate = 0;
  }

};






//since the character stat blocks are dynamic, the onclick is set up attached to the document
$(document).on('click', '.available', function(){
  //set attacker or defender, whichever needs to be set
    if(!game.attacker_character){
      game.setAttacker($(this).data("charactervar"));
      $('#genmessage').text("Choose your opponent!");
    }
    else if(!game.defender_character){
      game.setDefender($(this).data("charactervar"));
      $('#genmessage').text("Click the Attack button below to FIGHT!!");
      $('.attackbtn').toggle();
    }
  });

//click the attack button
$('.attackbtn').click(function(){
  //attack and counter attack
  $('#damagemessage').html(game.takeTurn());
  //if attacker is dead, game over
  if(game.checkIfDead(game.attacker_character)){
    $('.attackbtn').toggle();
    $('.resetbtn').toggle();
    game.removeAttacker();
    $('#genmessage').text("Oh no, you lost! Click the Reset button below to try again!");
  }
  //if defender is dead, next defender or gameover
  else if(game.checkIfDead(game.defender_character)){
    $('.attackbtn').toggle();
    game.removeDefender();
    $('#genmessage').text("You won that battle, but there's more to fight! Choose another opponent!");
    if(game.checkIfGameOver()){
      $('#genmessage').text("You did it, you're the best! Click the Reset button below to play again!");
      $('.resetbtn').toggle();
    }
  }
});

//reset the game
$('.resetbtn').click(function(){
  game.startGame();
  $('.resetbtn').toggle();
  $('#genmessage').text("Choose your character!");
});




//initialize
game.startGame();








//other functions
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
