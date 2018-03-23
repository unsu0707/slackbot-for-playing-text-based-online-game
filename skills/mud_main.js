module.exports = function(controller) {
  
  function random(max, min = 0){
    return Math.round(Math.random()*(max-min)+min);
  }
  
  class User {
    constructor(slack_id, name){
      this.slack_id = slack_id;
      this.name = name;
      this.level = 1;
      this.exp = [0,100];
      [this.hp,this.mp] = [[200,200],[100,100]];
      [this.str,this.sta,this.int,this.con,this.agi,this.luk] = [6,6,6,6,6,6];
      this.atk = this.str*2;
      this.def = this.con*1.5;
      this.place = 1;
      this.inven = [];
      this.equip = {"무기":null,"방어구":null,"장신구":null};
      this.mny = 0;
    }
    getItem(itemName){
      for(let i=0;i<this.inven.length;i++){
          console.log(this.inven[i].name);
        if(itemName == this.inven[i].name){
          return this.inven[i];
        }
      }
      console.log("null");
      return null;
    }
    addItem(item){
      this.inven.push(item);
      let msg = "\n *"+item.name+"* 을 획득했습니다.";
      return msg;
    }
    setEquip(item){
      let type = item.type;
      if(this.equip[type]){
        this.unsetEquip(this.equip[type]);
      }
      for(let i in this.inven){
        if(this.inven[i] == item){
          
          this.equip[type] = item;
          let removed = this.inven.splice(i,1);
        }
      }
      return `\n * ${this.equip[type].getName()} * 을 ${type}에 착용했습니다.`;
    }
    unsetEquip(item){
          console.log(item.name+"을 조사");
      for(let type in this.equip){
        if (this.equip[type] == item){
          console.log(item.name+"을 "+type+"에 착용중");
          this.inven.push(item);
          delete this.equip[type];
          return `\n *${item.name}* 을 착용 해제했습니다.`;
        }else{
          console.log(item.name+"을 "+type+"에 착용중이지 않음.");
        }
      }
      return `그런 아이템을 착용하고 있지 않습니다. ${item.name}`;
    }
    addExp(exp){
      let msg = "";
      let up_level = 0;
      this.exp[0] += exp;
      msg += "\n경험치 "+exp+"획득!";
      while (this.exp[0] >= this.exp[1]){
        this.exp[0] -= this.exp[1];
        up_level ++;
        this.level ++;
        this.exp[1] = this.level*100;
      }
      if(up_level >0){
        msg += `레벨 ${up_level} 상승! 현재 레벨 ${this.level}`
      }
      msg += "[경험치 : "+this.exp.join("/")+"]";
      return msg;
    }    
    addMny(mny){
      let msg = "";
      this.mny += mny;
      msg += "\n돈 "+mny+"획득! [소지금 :"+this.mny+"]";
      return msg;
    }
  }
  class Item {
    constructor(name,arr){
      //this.id = ;
      this.name = name;
      this.level = 0;
      this.price = arr.price;
      if (arr.type) this.type = arr.type;
      if (arr.stat) this.stat = arr.stat;
      if (arr.dur)  this.dur = [arr.dur,arr.dur];
    }
    getName(){
      if(this.type == "무기" || this.type == "방어구" || this.type == "장신구")
        return `+${this.level} ${this.name}`;
      return `${this.name}`;      
    }
  }
  const item_info = {
    "목검":{type:"무기",stat:{atk:1},price:100,dur:50},
    "천옷":{type:"방어구",stat:{def:1},price:100,dur:50},
    "힘의반지":{type:"장신구",stat:{str:1},price:500,dur:10},
    "지식의반지":{type:"장신구",stat:{int:1},price:500,dur:10},
    "토끼고기":{price:10,stat:{hp:5}},
    "도토리":{price:10,stat:{hp:10}},
    "복권":{price:500},
    "뼈조각":{price:50},
    "알밤":{price:100},
    "나무토막":{price:5}
  }
  /*
    무기
    {
      이름 : "목검"
      등급 : +5
      공격력 : 10
      가격 : 1000      
      타입 : "무기"
      내구 : 100/100
    }
    방어구
    {
      이름 : "천갑옷"
      등급 : +0
      방어력 : 5
      가격 : 1000
      타입 : "방어구"
      내구 : 100/100
    }
  
  */
  class Mob {
    constructor(name, arr){
      this.name = name;
      this.level = arr.level;
      if(!arr.hp) arr.hp = arr.level * 10;
      if(!arr.mp) arr.mp = arr.level * 5;
      if(!arr.atk) arr.atk = arr.level * 2;
      if(!arr.def) arr.def = arr.level * 1;
      if(!arr.mny) arr.mny = arr.level * 1;
      if(!arr.exp) arr.exp = arr.level * 5;
      [this.hp,this.mp] = [[arr.hp,arr.hp],[arr.mp,arr.mp]];
      this.atk = arr.atk;
      this.def = arr.def;
      this.mny = arr.mny;
      this.exp = arr.exp;
      this.inven = arr.inven;
    }
  }
  
  const places = ["공허","방","광장","초보수련장","앞마당"];
  const dungeons = {"초보수련장":[1,{"목각인형":100}],
                    "앞마당":[1,{"토끼":40,"다람쥐":50,"들개":10}]};
  const mob_info = {
  "목각인형":{level:1,item:{"나무토막":20}},
  "토끼":{level:2,item:{"토끼고기":90, "복권":10}},
  "다람쥐":{level:3,item:{"도토리":80, "알밤":10, "복권":10}},
  "들개":{level:5,item:{"뼈조각":20}}
  };
  
  let users = {};
  
  
  function newUserStart(user,bot, message){
    let res = "";    
    let slack_id = message.user;
    let name = message.match[1];
        if (!user) {
          let newUser = new User(slack_id,name); 
          let weapon = new Item("목검",item_info["목검"]);
          let armor = new Item("천옷",item_info["천옷"]);
          user = {
            id: message.user,
            info: newUser
          };
          res += user.info.addItem(weapon);
          res += user.info.addItem(armor);
          controller.storage.users.save(user, function(err, id) {
            res += "\n가입되었습니다. 유저명 : "+user.info.name;
            bot.reply(message,res);
          });
        }else {
          res += "이미 가입되었습니다. 유저명 : "+user.info.name;
          bot.reply(message,res);
        }
    /*
    console.log("slack id : "+slack_id+", name : "+name);
    console.log("get user..");
    let user_info = getUserInfo(slack_id);
    console.log(user_info);
    if(user_info){
      res += "이미 가입된 유저입니다. 유저명 :"+user_info.name;
      bot.reply(message,res);
    }else{
      controller.storage.users.save(newUser, function(err, id) {
        res += "가입되었습니다. 유저명 : "+newUser.name;
        bot.reply(message,res);
      });
    }
    */
  }
  
  function userConnect(usr,bot, message){
    let res = "";
    if(!usr){
      res = "`시작 (닉네임)` 으로 게임을 시작하세요.";      
    }else{
      if(usr.place == 0){
        usr.place = 1;
        res = "게임에 접속했습니다.";
      }
    }
    bot.reply(message,res);
  }
  
  function selectDungeon(usr, bot, message){
    let res = "";
    if(usr){
      let callback_id = 'select_dungeon_'+message.user;
      let avail_list = [];
      for(var key in dungeons){
        if (dungeons[key][0] <= usr.level){
          avail_list.push({"name":key,"text":key,"value":key,"type":"button"});
        }
      }
      let prefix = "["+usr.name+"]";
    bot.reply(message, {
        attachments:[
            {
                title: prefix+'사냥터를 선택하세요.',
                callback_id: callback_id,
                attachment_type: 'default',
                actions: avail_list
            }
        ]
    });
    }else{
      res = "";
    }
    bot.reply(message,res);
  }
  
  function genMob(mobs){
    let ran_next = 0; //다음 몹 등장확률
    let inven = [];
    let percent = 100;
    //50, 40, 10
    //0~50, 51~90, 91~100
    for (var key in mobs){
      let ran = random(percent); //몹 등장확률
      let ran_next = mobs[key];
      console.log(key+":"+ran_next+"/"+ran);
      if(ran_next >= ran){
        //Gen!
        let mobInfo = mob_info[key];
        let arr = {level:mobInfo.level};
        
        percent = 100;
        
        if(mobInfo.item){
          let ran_item_next = 0;
          let items = mobInfo.item;
          for(var ikey in items){
            let ran_item = random(percent);
            let ran_item_next = items[ikey];
            console.log(ikey+":"+ran_item_next+"/"+ran_item);
            if(ran_item_next >= ran_item){
              let item = item_info[ikey];
              console.log(ikey+":"+item.price);
              inven.push(new Item(ikey, item));
              break;
            }else{
              percent -= ran_item_next;
            }
          }
          arr.inven = inven;
        }
        let mob = new Mob(key, arr);
        console.log(mob.name+":"+mob.level+":"+mob.inven[0]);
        return mob;        
      }else{
        percent -= ran_next;
      }
    }    
  }
  function fight(usr, mob){
    let prompt = "";
      prompt += usr.name+"(Lv."+usr.level+")[공"+usr.atk+"방"+usr.def+"] VS ";
      prompt += mob.name+"(Lv."+mob.level+")[공"+mob.atk+"방"+mob.def+"]\n";
    while(usr.hp[0] > 0 && mob.hp[0] > 0){
      let usr_dmg = (usr.atk - mob.def > 0)?usr.atk - mob.def:0;
      let mob_dmg = (mob.atk - usr.def > 0)?mob.atk - usr.def:0;
      mob.hp[0] -= usr_dmg;
      prompt += usr.name+"이(가) "+mob.name+"을(를) 공격했다. -"+usr_dmg+" ["+mob.hp.join("/")+"] \n";
      if(mob.hp[0] <= 0){
        prompt += mob.name+"이(가) 쓰러졌다.";
        //전리품
        for(var key in mob.inven){
          if(mob.inven[key]){
            console.log(mob.inven[key].name);
            let item = mob.inven[key];
            prompt += usr.addItem(item);
          }
        }
        console.log(prompt);
        //돈획득
        prompt += usr.addMny(mob.mny);
        console.log(prompt);
        //경험치획득
        prompt += usr.addExp(mob.exp);
        console.log(prompt);
        mob = null;
        break;
      }
      
      usr.hp[0] -= mob_dmg;
      prompt += mob.name+"이(가) "+usr.name+"을(를) 공격했다. -"+mob_dmg+" ["+usr.hp.join("/")+"] \n";
      
      if(usr.hp[0] <= 0){
        prompt += usr.name+"이(가) 쓰러졌다.";
        break;
      }
    //usr turn
      //mob.hp[0] -= usr.atk - mob.def;
    //mob turn
      //usr.hp[0] -= mob.atk - usr.def;
      
    }
        console.log(prompt);
    return prompt;
  }
  function goDungeon(usr, bot, message){
    let res = "";
    if(usr){
      var text = ""

      let prefix = "["+usr.name+"]";
      text += prefix;
      const name = message.actions[0].name;
      let dungeon = dungeons[name];
      if(dungeon){
        let mobList = dungeon[1];
        let mob = genMob(mobList);
        console.log(mob.name+":"+mob.level+":"+mob.inven[0]);
        text += " *"+mob.name+"* (Lv."+mob.level+")이(가) 모습을 드러냈다!"
        text += fight(usr,mob);
        
      }else{
        text += "그런 이름의 사냥터가 없습니다.";
      }

      bot.replyInteractive(message, {
        "text": text
      });
    }
  }
  
  function showInven(usr,bot,message){
    let res = "";
    if(usr){
      let prefix = "["+usr.name+"]";
      res += prefix;
      res += "님의 소지품";
      for (let i=0;i<usr.inven.length;i++){
        if(usr.inven[i]){
          res += " "+usr.inven[i].getName()+" ";
        }
      }
    }
    bot.reply(message, res);
  }
  
  function showEquip(usr,bot,message){
    let res = "";
    if(usr){
      let prefix = "["+usr.name+"]";
      res += prefix+"님이 착용중인 장비 : ";
      for (var key in usr.equip){
        if(usr.equip[key]){
          res += `[${key}] ${usr.equip[key].getName()}`;
        }
      }
    }
    bot.reply(message, res);
  }
  
  function setEquip(usr,bot,message){
    let res = "";
    if(usr){
      let itemName = message.match[1];
      console.log(itemName);
      let item = usr.getItem(itemName);
      console.log(item.name);
      res = usr.setEquip(item);
    }
    bot.reply(message, res);
  }
  
  function unsetEquip(usr,bot,message){
    let res = "";
    if(usr){
      let type = message.match[1];
      let item = usr.equip[type];
      console.log("usr.unsetEquip("+type+":"+item.name+")");
      res = usr.unsetEquip(item);
    }
    bot.reply(message, res);
  }
  
  controller.hears(["^시작 ([가-힣]+)$"],'direct_message',(bot,message) => {
    console.log(message.user);
    controller.storage.users.get(message.user, function(err, user){
      newUserStart(user,bot,message);
    });
  });
  
  controller.hears(["^접속$"],'direct_message',(bot,message) => {
    console.log(message.match[0]);
    controller.storage.users.get(message.user, function(err, user){
      userConnect(user.info,bot,message);
    });
  });
    
  controller.hears(["^사냥$"],'direct_message',(bot,message) => {
    console.log(message.match[0]);
    controller.storage.users.get(message.user, function(err, user){
      selectDungeon(user.info,bot,message);
      controller.storage.users.save(user, function(err, id) {
        console.log("saved!!");
      });
    });
  });
  
  
  controller.hears(["^(소|소지|소지품|템|아이템|소지템)$"],'direct_message',(bot,message) => {
    console.log(message.match[0]);
    controller.storage.users.get(message.user, function(err, user){
      showInven(user.info,bot,message);
    });
  });
  
  
  controller.hears(["^(장비)$"],'direct_message',(bot,message) => {
    console.log(message.match[0]);
    controller.storage.users.get(message.user, function(err, user){
      showEquip(user.info,bot,message);
    });
  });
  
  
  controller.hears(["^해제 ([가-힣]+)$"],'direct_message',(bot,message) => {
    console.log(message.match[0]);
    controller.storage.users.get(message.user, function(err, user){
      unsetEquip(user.info,bot,message);
      
      controller.storage.users.save(user, function(err, id) {
        console.log("saved");
      });
    });
  });
  
  controller.hears(["^착용 ([가-힣]+)$"],'direct_message',(bot,message) => {
    console.log(message.match[0]);
    controller.storage.users.get(message.user, function(err, user){
      setEquip(user.info,bot,message);
      
      controller.storage.users.save(user, function(err, id) {
        console.log("saved");
      });
    });
  });
  
  controller.on('interactive_message_callback', function(bot, message) {
    console.log(message.callback_id);
    controller.storage.users.get(message.user, function(err, user){
      if (message.callback_id.includes("select_dungeon") && message.callback_id.includes(message.user) ) {
        goDungeon(user.info,bot,message);
        controller.storage.users.save(user, function(err, id) {
          console.log("saved!!");
        });
      }
    });
  });
  
controller.hears(['유저전체삭제'], 'direct_message,direct_mention,mention', function(bot, message) {
  controller.storage.users.all(function(err, all_user_data) {
  for(var user in all_user_data){
    var id = all_user_data[user].id;
    controller.storage.users.delete(id, function(err){console.log("removed");});
  }
  });
});
controller.hears(['유저전체확인'], 'direct_message,direct_mention,mention', function(bot, message) {
  controller.storage.users.all(function(err, all_user_data) {
for (const prop in all_user_data) {
  if (all_user_data.hasOwnProperty(prop)) {
    const obj = all_user_data[prop];
    console.log(`all_user_data.${prop} = ${obj}`);
    for (const prop2 in obj){
      const obj2 = obj[prop2];
      if (obj.hasOwnProperty(prop2)) {
      console.log(`all_user_data.${prop}.${prop2} = ${obj2}`);
      }
    }
  } 
}
  });
});
  
controller.hears(['유저확인'], 'direct_message,direct_mention,mention', function(bot, message) {
  controller.storage.users.get(message.user, function(err, obj) {
    
    console.log(obj);
    for (const prop2 in obj){
      const obj2 = obj[prop2];
      if (obj.hasOwnProperty(prop2)) {
        console.log(`user_data.${prop2} = ${obj2}`);
      }
    }
  });
});
  
  
controller.hears(['^(.+)$'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
  console.log(message.user+":"+message.match[0]);
});
}