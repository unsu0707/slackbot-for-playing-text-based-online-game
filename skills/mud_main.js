module.exports = function(controller) {
  
  ///-------------- 공통 변수/상수 --------------------------///
  const userScope = 'direct_message,ambient';
  const adminScope = 'direct';
  const broadcast_channel = "C9W1H2SE9";  
    
  const dungeons = {"초보수련장":[1,{"목각인형":100}],
                    "초원":[1,{"토끼":40,"다람쥐":50,"들개":10}],
                    "버섯숲":[5,{"팽이벌레":20,"목이벌레":20,"석이벌레":20,"송이벌레":20,"꽃송이벌레":10,"새송이벌레":10}],
                    "가시동굴":[10,{"풀덩굴두더지":20,"가시덩굴두더지":20,"독거미":20,"작은뱀":20,"큰뱀":20}],
					"초급광산":[18,{"게으른광부":20,"박쥐":20,"황금박쥐":5,"흙골렘":20,"작은골렘":20,"광산두더지":15}],
					"중급광산":[26,{"철골렘":10,"청동골렘":10,"백은골렘":10,"황금골렘":5,"은박쥐":25,"고블린":20,"홉고블린":15}],
                   };
  const mob_info = {
  "목각인형":{level:1,item:{"나무토막":20, "회복스킬북":1}},
  "토끼":{level:2,item:{"토끼고기":90, "복권":10}},
  "다람쥐":{level:3,item:{"도토리":80, "알밤":10, "복권":10}},
  "들개":{level:5,item:{"뼈조각":20}},
  "팽이벌레":{level:10,item:{"식용버섯":30, "힘의반지":2, "지식의반지":1}},
  "목이벌레":{level:11,item:{"식용버섯":30, "힘의반지":1, "지식의반지":2}},
  "석이벌레":{level:12,item:{"식용버섯":30, "힘의반지":3}},
  "송이벌레":{level:13,item:{"식용버섯":30, "지식의반지":3}},
  "꽃송이벌레":{level:15,item:{"식용버섯":30, "힘의반지":3, "지식의반지":3}},
  "새송이벌레":{level:20,item:{"식용버섯":30, "힘의반지":3, "지식의반지":3}},
  "풀덩굴두더지":{level:22,item:{"힘의반지":20},},
  "가시덩굴두더지":{level:24,item:{"지식의반지":20},},
  "독거미":{level:26,item:{"복권":5}},
  "작은뱀":{level:23,item:{"뱀고기":25}},
  "큰뱀":{level:27,item:{"뱀고기":25}},
  "게으른광부":{level:34,item:{"낡은곡괭이":5,"광부조끼":5,"복권":5,"돌조각":10,"철조각":10,"청동조각":5,"백은조각":3,"황금조각":2}},
  "박쥐":{level:30,item:{"박쥐의날개":20,"복권":5,"중급회복물약":5,"청동조각":5,"복권":3}},
  "황금박쥐":{level:37,item:{"박쥐의날개":20,"황금조각":30,"복권":25}},
  "흙골렘":{level:42,item:{"흙조각":30,"복권":3}},
  "작은골렘":{level:40,item:{"돌조각":30,"복권":5}},
  "광산두더지":{level:34,item:{"복권":5}},
  "철골렘":{level:44,item:{"철조각":30,"복권":5}},
  "청동골렘":{level:46,item:{"청동조각":28,"복권":5}},
  "백은골렘":{level:48,item:{"백은조각":30,"복권":5}},
  "황금골렘":{level:55,item:{"황금조각":10,"복권":15}},
  "은박쥐":{level:36,item:{"백은조각":10,"복권":10}},
  "고블린":{level:50,item:{"고블린대거":5,"고블린철갑":5,"복권":5}},
  "홉고블린":{level:60,item:{"고블린대거":5,"고블린철갑":5,"복권":5}},
  
  };  
  
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
    "나무토막":{price:5},
    "식용버섯":{price:100,stat:{hp:50}},
    "회복스킬북":{price:1000},
	"뱀고기":{price:200,stat:{hp:100}},
	"골렘조각":{price:100},
	"철조각":{price:100},
	"청동조각":{price:100},
	"백은조각":{price:100},
	"황금조각":{price:100},
	"흙조각":{price:100},
	"돌조각":{price:100},
	"낡은곡괭이":{type:"무기",stat:{atk:12},price:100,dur:50},
	"고블린대거":{type:"무기",stat:{atk:25},price:100,dur:50},
	"광부조끼":{type:"방어구",stat:{def:15},price:100,dur:50},
	"고블린철갑":{type:"방어구",stat:{def:30},price:100,dur:50},
	"박쥐의날개":{price:100},
	"중급회복물약":{price:100,stat:{hp:500}},
  }
  
  
  
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
      this.place = "시작방";
      this.inven = [];
      this.equip = {"무기":null,"방어구":null,"장신구":null};
      this.mny = 0;
      this.stp = 5;
      this.skill = {};
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
  }
  
    function addExp(usr, exp){
      let msg = "";
      let up_level = 0;
      usr.exp[0] += exp;
      msg += "\n *경험치* +"+exp+" 획득!";
      while (usr.exp[0] >= usr.exp[1]){
        usr.exp[0] -= usr.exp[1];
        up_level ++;
        usr.level ++;
        usr.stp += 2;
        msg += `레벨업! ${usr.level-1} -> ${usr.level} (수련치 2 획득)`
        usr.exp[1] = usr.level*100;
        usr.hp[0] = usr.hp[1];
      }
      if(up_level >0){
        msg += `레벨 ${up_level} 상승! 현재 레벨 ${usr.level}`
      }
      msg += "[경험치 : "+usr.exp.join("/")+"]";
      console.log(msg);
      return msg;
    }    
    function addMny(usr, mny){
      let msg = "";
      usr.mny += mny;
      msg += "\n *"+mny+" 골드* 획득! [현재 소지금 : "+usr.mny+" 골드]";
      console.log(msg);
      return msg;
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
      this.equiped = false;
    }
    getName(){
      if(this.type == "무기" || this.type == "방어구" || this.type == "장신구")
        return `+${this.level} ${this.name}`;
      return `${this.name}`;      
    }
  }
  
  class Mob {
    constructor(name, arr){
      this.name = name;
      this.level = arr.level;
      if(!arr.hp) arr.hp = arr.level * 10 - random(arr.level) + random(arr.level);
      if(!arr.mp) arr.mp = arr.level * 5 - random(arr.level) + random(arr.level);
      if(!arr.atk) arr.atk = arr.level * 2 + random(arr.level/2) - random(arr.level/2);
      if(!arr.def) arr.def = arr.level * 1 + random(arr.level/4) - random(arr.level/4);
      if(!arr.mny) arr.mny = arr.level * 1 + random(arr.level/4) - random(arr.level/4);
      if(!arr.exp) arr.exp = arr.level * 4 - random(arr.level) + random(arr.level);
      [this.hp,this.mp] = [[arr.hp,arr.hp],[arr.mp,arr.mp]];
      this.atk = arr.atk;
      this.def = arr.def;
      this.mny = arr.mny;
      this.exp = arr.exp;
      this.inven = arr.inven;
      this.weapon = arr.weapon;
      this.expr = arr.expr;
    }
  }
  
  
  
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
          res += user.info.inven.push(weapon);
          res += user.info.inven.push(armor);
          controller.storage.users.save(user, function(err, id) {
            res += "\n가입되었습니다. 유저명 : "+user.info.name;
            bot.reply(message,res);
          });
        }else {
          res += "이미 가입되었습니다. 유저명 : "+user.info.name;
          bot.reply(message,res);
        }
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
  function showInven(usr,bot,message){
    let res = "";
    if(usr){
      let prefix = "["+usr.name+"]";
      res += prefix;
      res += "님의 소지품\n";
      let item_list = {};
      for (var i=0;i<usr.inven.length;i++){
        if(usr.inven[i]){
          let name = usr.inven[i].name;
          if(item_list[name]){
            item_list[name]++;
          }else{
            item_list[name]=1;
          }
        }
      }
      for (let key in item_list){
        res += `${key}`;
        if(item_list[key] > 1){
          res += `(x${item_list[key]})`;
        }
        res += ",";
      }
      
    bot.reply(message, res);
  
    }
  }
  
  controller.hears(["^(소|소지|소지품|템|아이템|소지템)$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.users.get(message.user, function(err, user){
      showInven(user.info,bot,message);
    });
  });
  
  function showEquip(usr,bot,message){
    let res = "";
    if(usr){
      let prefix = "["+usr.name+"]";
      res += prefix+"님이 착용중인 장비 : ";
      console.log(res);
      for(var key in usr.equip){
        if(usr.equip[key]){
          res += `[${key}]${usr.equip[key].name}`;
          for(var key2 in usr.equip[key].stat){
            res += `(${key2}:${usr.equip[key].stat[key2]})`;
          }
        }
      }
    }
    bot.reply(message, res);
  }
  
  function setEquip(usr,bot,message){
    let res = "";
    if(usr){
      let itemName = message.match[1];
      console.log(itemName+"을 가져옵니다.");
      for(let i=0;i<usr.inven.length;i++){
        if(itemName == usr.inven[i].name){
          let type = usr.inven[i].type;
          if(["무기","방어구","장신구"].indexOf(type) >= 0){
            if(usr.equip[type]){
              let equipedItem = usr.equip[type];
              usr.equip[type].equiped = false;
              res += usr.equip[type].name+"을 해제했습니다."; 
            }
            usr.equip[type] = usr.inven[i];
            usr.inven[i].equiped = true;
            res += usr.equip[type].name+"을 착용했습니다.";
          }else{
            res += "착용할 수 없는 아이템입니다.";
          }
          break;
        }
      }
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
  
  //([가-힣]+) 봐
  function showItemInfo(usr,bot,message){
    let res = "";
    if(usr){
      
    }
    bot.reply(message,res);    
  }
  
  //([가-힣]+) 먹어|사용
  function intakeItem(usr,bot,message){
    let res = "";
    if(usr){
      let item_name = message.match[1];
      let ind = -1;
      for (var i=0;i<usr.inven.length;i++){
        if(item_name == usr.inven[i].name){
          console.log("inventory ["+i+"] = "+usr.inven[i].name);
          ind = i;
          break;
        }
      }
      if(ind > 0){
      let item = usr.inven[ind];
        if(item && item.stat.hp > 0){
          usr.hp[0] += item.stat.hp;
          if(usr.hp[0] > usr.hp[1]) usr.hp[0] = usr.hp[1];
          res += usr.name+"님이 "+item.name+"을(를) 먹고 체력 "+item.stat.hp+"을 회복합니다.";
          usr.inven.splice(ind,1);
        }
      }
    }
    bot.reply(message,res);
  }
  
  
  controller.hears(["^([가-힣]+) 먹어$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.users.get(message.user, function(err, user){
      console.log(user.info);
      intakeItem(user.info,bot,message);
      controller.storage.users.save(user, function(err, id) {
        console.log("saved!!");
      });
    });
  });
  
  //상점
  function showMerchantList(usr,bot,message){
    let res = "";
    if(usr){
      
    }
    bot.reply(message,res);    
  }
  
  //[무기상|갑옷상|...] 
  function showMerchantItemList(usr,bot,message){
    let res = "";
    if(usr){
      
    }
    bot.reply(message,res);    
  }
  
  function buyMerchantItem(usr,bot,message){
    let res = "";
    if(usr){
      
    }
    bot.reply(message,res);    
  }
  
  function sellMerchantItem(usr,bot,message){
    let res = "";
    if(usr){
      
    }
    bot.reply(message,res);    
  }
  
  function levelUpItem(usr,bot,message){
    let res = "";
    if(usr){
      
    }
    bot.reply(message,res);    
  }
  
  controller.hears(["^시작 ([가-힣]+)$"],userScope,(bot,message) => {
    console.log(message.user);
    controller.storage.users.get(message.user, function(err, user){
      newUserStart(user,bot,message);
    });
  });
  
  controller.hears(["^접속$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.users.get(message.user, function(err, user){
      userConnect(user.info,bot,message);
    });
  });
  class Room {
    constructor(name,desc="",arr={}){
      this.name = name;
      this.desc = desc;
      this.ways = arr;
      this.objs = [];
    }
  }
  function getOppoWay(way){
    let res = "";
    switch(way){
      case "동":
        res="서";
        break;        
      case "서":
        res="동";
        break;
      case "남":
        res="북";
        break;
      case "북":
        res="남";
        break;
      case "위":
        res="밑";
        break;
      case "밑":
        res="위";
        break;
      default:
        res="밖";
        break;
              }
    return res;
  }
  function checkSameRoom(world,name){
    let res = false;
    for(var roomName in world){
      if(roomName == name){
        res = true;
        break;
      }
    }
    return res;
  }
  controller.hears(["^월드 (생성|확인|삭제)$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.teams.get(message.team, function(err, team){
      switch (message.match[1]) {
      case "생성":
          controller.storage.users.get(message.user, function(err, user){
            let newWorld = {};
            let firstRoom = new Room("시작방","이 곳은 시작하면 도착하는 방입니다.");
            newWorld["시작방"] = firstRoom;      
            user.info.place = "시작방";
            firstRoom.objs.push(user.info);
            team.world = newWorld;
            controller.storage.users.save(user, function(err, id) {
              console.log("User saved!!");
            });
            controller.storage.teams.save(team, function(err, id){
              console.log("World saved!!"); 
            });
          });
        break;
      case "확인":
        if(team.world){
              for(var room in team.world){
                let log = "";
                log += room +":";
                log += "[ways]";
                for (var way in team.world[room].ways){
                  log += "("+way+")"+team.world[room].ways[way]+" ";
                }
                log += "[objs]";
                for (var obj in team.world[room].objs){
                  log += "("+obj+")"+team.world[room].objs[obj].name+" ";
                }
                console.log(log);
              }
        }
        break;
      case "삭제":
        if(team.world){
          delete team.world;
            controller.storage.teams.save(team, function(err, id){
              console.log("World saved!!"); 
            });
        }
        break;
      }
    });
  });
  
  function makeNewRoom(world,bot,message){
    let res = "";
    if(world){
      let roomName = message.match[1];
      if (checkSameRoom(world,roomName) == false){
        let newRoom = new Room(roomName);
        world[roomName] = newRoom;
        res += "새로운 방("+world[roomName].name+")이 만들어졌습니다.";
      }else{
        res += "이미 같은 이름의 방이 존재합니다.";
      }
    }
    bot.reply(message,res);
  }
  
  controller.hears(["^방만들기 (.+)$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.teams.get(message.team, function(err, team){
      makeNewRoom(team.world,bot,message);
      controller.storage.teams.save(team, function(err, id){console.log("World saved!!");});
    });
  });
  
  function connRoom(world,bot,message){
    let res = "";
    if(world){
      console.log("world is exist");
        let roomWay = message.match[1];
        let roomWay2 = getOppoWay(roomWay);
        let roomNameFrom = message.match[2];
        let roomNameTo = message.match[3];
      if(world[roomNameFrom] && world[roomNameTo]){
        console.log("world["+roomNameFrom+","+roomNameTo+"] is exist");
        let roomFrom = world[roomNameFrom];
        let roomTo = world[roomNameTo];
        roomFrom.ways[roomWay] = roomNameTo;
        roomTo.ways[roomWay2] = roomNameFrom;          
      }else{
        res += "그런 이름의 방이 없습니다. ("+roomNameFrom+","+roomNameTo+")";
      }
    }
    bot.reply(message,res);
  }
  
  controller.hears(["^방연결 ([가-힣]+) (.+) (.+)$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.teams.get(message.team, function(err, team){
        connRoom(team.world,bot,message);
        controller.storage.teams.save(team, function(err, id){console.log("World saved!!");});
    });
  });
  
  function showRoom(world,user,bot,message){
    let res = "";
    if(world && user){
      if(world[user.place]){
        let nowRoom = world[user.place];
        res += `[${nowRoom.name}]\n`;
        res += `${nowRoom.desc}\n`;
        res += "출구 : ";
        for (var way in nowRoom.ways){
          if ( way && nowRoom.ways[way] )
            res += way+",";
        }
        res += "\n";
        for (var objName in nowRoom.objs){
          let obj = nowRoom.objs[objName];
          if(obj){
            let desc;
            if(obj.desc){
              desc = obj.desc;
            }else{
              desc = obj.name+"이(가) 있습니다.";
            }
            res += desc+"\n";
          }
        }
      }
    }
    bot.reply(message, res);
  }
  
  controller.hears(["^(봐|주변|현재위치)$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.teams.get(message.team, function(err, team){
      controller.storage.users.get(message.user, function(err, user){
        showRoom(team.world,user.info,bot,message);
      });
    });
  });
  function remove(array, element) {
    const index = array.indexOf(element);
    if (index !== -1) {
        array.splice(index, 1);
    }else{
      for(var obj in array){
        if(array[obj].name == element.name)
          delete array[obj];
      }
    }
  }
  function moveRoom(world,user,bot,message){
    let res = "";
    if(world && user) {
      let way = message.match[1];
      let roomFrom = world[user.place];
      let roomTo = world[roomFrom.ways[way]];
      if(roomTo){
        remove(roomFrom.objs, user);
        roomTo.objs.push(user);
        user.place = roomTo.name;
        showRoom(world,user,bot,message);
      }
    }
    bot.reply(message,res);
  }
  
  controller.hears(["^(동|서|남|북|위|밑|밖)$","^([가-힣]+) 가$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.teams.get(message.team, function(err, team){
      controller.storage.users.get(message.user, function(err, user){
        moveRoom(team.world,user.info,bot,message);
        controller.storage.users.save(user, function(err, id){console.log("User saved!!");});
        controller.storage.teams.save(team, function(err, id){console.log("World saved!!");});
      });
    });
  });
  
  function trainStat(user,bot,message){
    let res = "";
    if(user) {
      if(user.stp > 0){
        let stat_name;
        switch(message.match[1])
        {
          case "힘":
            stat_name = "str";
            break;
          case "민첩":
            stat_name = "agi";
            break;
          case "지식":
            stat_name = "int";
            break;
          case "맷집":
            stat_name = "sta";
            break;
          case "집중":
            stat_name = "con";
            break;
          case "운":
            stat_name = "luk";
            break;
          case "체력":
          case "HP":
          case "hp":
            stat_name = "hp";
            break;
          case "마력":
          case "MP":
          case "mp":
            stat_name = "mp";
        }
        if(stat_name == "hp" || stat_name == "mp"){
          const pnt = Math.round(user[stat_name][1]/10);;
          user[stat_name][1] += pnt;
          res += `${message.match[1]}을 수련하여 ${pnt} 만큼 향상되었습니다. ${user[stat_name][1]-pnt} -> ${user[stat_name][1]}`;
          user.stp --;
        }else if(user[stat_name]){
          user[stat_name]++;
          res += `${message.match[1]}을 수련하여 1 만큼 향상되었습니다. ${user[stat_name]-1} -> ${user[stat_name]}`;
          user.stp --;
        }
      }else{
        res += "수련치가 부족합니다. 레벨업으로 수련치를 획득하세요. `정보` ";
      }
    }
    bot.reply(message,res);
  }
  
  controller.hears(["^([가-힣]+) (수련|올려|향상)$"],userScope,(bot,message) => {
    console.log(message.match[0]);
      controller.storage.users.get(message.user, function(err, user){
        trainStat(user.info,bot,message);
        controller.storage.users.save(user, function(err, id){console.log("User saved!!");});
      });
  });
  
  function learnSkill(user,bot,message){
let res="";
if (user){
  
  if (!user.skill){
    console.log("no skill");
    let skillarr = {};
	  user.skill = skillarr;
  }
  let skill_name = message.match[1];
  for(var i=0;i<user.inven.length;i++){
    console.log(`${user.inven[i].name} VS ${skill_name}스킬북`);
    if(user.inven[i].name == `${skill_name}스킬북`){
      console.log("스킬북 발견");
      user.inven.splice(i,1);
      res += skill_name+" 스킬북을 정독합니다.\n";
      if(user.skill[skill_name] > 0){
        res += `${skill_name} 스킬의 레벨이 향상되었습니다. ${user.skill[skill_name]++}`;
      res += `${user.skill[skill_name]}\n`;
      }else{
        user.skill[skill_name] = 1;
        res += `${skill_name} 스킬을 획득하였습니다. 현재 스킬레벨 : 1\n`;
      res += "`"+skill_name+" 시전` 으로 사용할 수 있습니다.\n";
      }
      break;
	  }
  }
}
bot.reply(message,res);
  }
  
  controller.hears(["^([가-힣]+) 배워$"],userScope,(bot,message) => {
    console.log(message.match[0]);
      controller.storage.users.get(message.user, function(err, user){
        learnSkill(user.info,bot,message);
        controller.storage.users.save(user, function(err, id){console.log("User saved!!");});
      });
  });
  
  function useSkill(user,bot,message){
let res="";
if (user){
  let skill_name = message.match[1];
  if (!user.skill){
    user.skill = {};
  }
  if (user.skill[skill_name] > 0){
    const skill_level = user.skill[skill_name];
    switch(skill_name){
      case "회복":
          res += "*회복* 스킬을 외웁니다. '윙가르디움레비오-사!!삼이일땡!!' \n"
          const eff = Math.round(skill_level*100 * random(4,2)/2);
          user.hp[0] += eff;
          if(user.hp[1] < user.hp[0]) user.hp[0] = user.hp[1];
          res += `성스러운 기운으로 체력이 ${eff} 만큼 회복됩니다. [${user.hp.join("/")}]`;
        break;
    }
  }else{
    res += "그런 스킬을 배운 적이 없습니다. 스킬북이 있으면 `(스킬이름) 배워` 로 배워보세요. ";
  }
}
bot.reply(message,res);
  }
  
  controller.hears(["^([가-힣]+) 시전$"],userScope,(bot,message) => {
    console.log(message.match[0]);
      controller.storage.users.get(message.user, function(err, user){
        useSkill(user.info,bot,message);
        controller.storage.users.save(user, function(err, id){console.log("User saved!!");});
      });
  });
  
  
  
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
        let arr = {level:mobInfo.level,weapon:mobInfo.weapon,expr:mobInfo.expr};
        
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
  function getAtk(usr){
    let res = 0;
    res += Math.round(usr.level + usr.str*1.5 + usr.sta/2 + usr.luk/5);
    if (usr.equip["무기"]){
      res += usr.equip["무기"].stat.atk;
    }    
    return res;
  }
  function getDef(usr){
    let res = 0;
    res += Math.round(usr.level + usr.sta*1.5 + usr.str/3 + usr.agi/5 + usr.luk/5);
    if (usr.equip["방어구"]){
      res += usr.equip["방어구"].stat.def;
    }    
    return res;
  }
  
  function fight(usr, mob){
    usr.atk = getAtk(usr);
    usr.def = getDef(usr);
    let prompt = "";
      prompt += usr.name+"(Lv."+usr.level+") [ATK "+usr.atk+"/DEF "+usr.def+"] VS ";
      prompt += mob.name+"(Lv."+mob.level+")[ATK "+mob.atk+"/DEF "+mob.def+"]\n";
    while(usr.hp[0] > 0 && mob.hp[0] > 0){
      console.log(prompt);
      let usr_dmg = (usr.atk - mob.def) + random(usr.luk/3+usr.con/3) - random(2);
      if(usr_dmg<0) usr_dmg=random(usr.con/3+usr.luk/3);
      if(usr_dmg>0){
      mob.hp[0] -= usr_dmg;
      let usr_wpn = "맨손";
      if(usr.equip["무기"]) usr_wpn = usr.equip["무기"].name;
      prompt += usr.name+"이(가) "+mob.name+"을(를) "+usr_wpn+"(으)로 공격했다.: -"+usr_dmg+" ["+mob.hp.join("/")+"] \n";
      console.log(prompt);
      if(mob.hp[0] <= 0){
        prompt += mob.name+"이(가) 쓰러졌다.";
        console.log(prompt);
        //전리품
        for(var key in mob.inven){
          console.log(key);
          if(mob.inven[key]){
            let item = mob.inven[key];
              console.log(item.name);
            
            console.log("inventory:"+usr.inven);
            usr.inven.push(item);
            prompt += "\n *"+item.name+"* 을 획득했습니다.";
          }
        }
         prompt += addMny(usr, mob.mny);
        //경험치획득
         prompt += addExp(usr, mob.exp);
        mob = null;
        break;
      }
      }else{
        prompt += usr.name+" -> "+mob.name+" 공격! : 빗나갔다.. \n";
      }
      let mob_dmg = (mob.atk - usr.def) + random(mob.level,mob.level/2) - random(mob.level,mob.level/2);
      if (mob_dmg < 0) mob_dmg = random(2);
      if(mob_dmg>0){
        usr.hp[0] -= mob_dmg;
        prompt += mob.name+"이(가) "+usr.name+"을(를) ";
        if(mob.weapon){
          prompt += `${mob.weapon}(으)로 ${mob.expr[random(mob.expr.length-1)]}`;
        }
        prompt += ": -"+mob_dmg+" ["+usr.hp.join("/")+"] \n";

        if(usr.hp[0] <= 0){
          usr.hp[0] = 1;
          prompt += usr.name+"이(가) 쓰러졌다. ( 아이템을 먹어 회복하거나, `회복 시전` 을 사용하세요. ) ";
          break;
        }
      }else{
        prompt += mob.name+" -> "+usr.name+" 공격! : 빗나갔다.. \n";
      }
    //usr turn
      //mob.hp[0] -= usr.atk - mob.def;
    //mob turn
      //usr.hp[0] -= mob.atk - usr.def;
      
    }
    return prompt;
    
  }
  
  function goDungeon(usr, bot, message){
    let res = "";
    if(usr){
      console.log("goDungeon");
      let dungeon_list="";
      if (!message.match[1]){
        for(var key in dungeons){
          if (dungeons[key][0] <= usr.level){
            dungeon_list += `${key} (요구레벨:${dungeons[key][0]})\n`;
          }else{
            dungeon_list += `~${key} (요구레벨:${dungeons[key][0]})~\n`;
          }
          
        }
        console.log(dungeon_list+"??");
      }
      
      var text = ""

      let prefix = "["+usr.name+"]";
      text += prefix;
      const name = message.match[1];
      let dungeon = dungeons[name];
      if(dungeon){
        let mobList = dungeon[1];
        let mob = genMob(mobList);
        console.log(mob.name+":"+mob.level+":"+mob.inven[0]);
        text += ` *${mob.name}* (Lv.${mob.level}) 발견!\n`;
        text += fight(usr,mob);
        
      }else{
        text += " `사냥 (사냥터이름)` 명령어를 사용하세요.\n"+dungeon_list;
      }

      bot.reply(message, text);
    }
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
  
  
  controller.hears(["^사냥 ([가-힣]+)$","^사냥$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.users.get(message.user, function(err, user){
      console.log(user.info);
      goDungeon(user.info,bot,message);
      controller.storage.users.save(user, function(err, id) {
        console.log("saved!!");
      });
    });
  });
  
  function useLottery(){
	  let res = "";
	  const lucky_num = random(20);
	  res += `복권을 긁습니다. 행운의 숫자는.. [${lucky_num}]\n`;
	  let award = random(15,7)*lucky_num;
	  res += `기본금액=${award} x (5배x당첨횟수,2배x당첨횟수)\n`;
	  let count = 0;
    let count2 = 0;
	  for(let i=1;i<=10;i++){
		  const num = random(20);
		  if(lucky_num==num){
		    res += `*${num}* (당첨), `;
        count ++;
		  }else if(lucky_num-1 == num || lucky_num+1 == num){
		    res += `*${num}* (까비), `;
        count2 ++;
		  }else{
        res += `~${num}~, `;
      }
	  }
    award *= Math.pow(5,count);
    award *= Math.pow(2,count2);
	  res += `\n당첨금은 ${award}골드 입니다. (${count}당첨 ${count2}까비)`;
	  return [award, res];
  }
 /*
   4일때
   복권가격 1000원
   0000 : 0원
   0004 : 1000원
   0044 : 10000원
   0034 : 5000원
   0444 : 100000원
   0344 : 50000원
   0334 : 
   4444 : 1000000원
   
 */
  function getItemIndex(user,itemname){
	  for(var i=0;i<user.inven.length;i++){
		  if(user.inven[i].name == itemname){
			  return i;
		  }
	  }
	  return -1;
  }
  function useItem(user,bot,message){
    let res = "";
    if(user){
		const itemInd = getItemIndex(user,message.match[1]);
      console.log(itemInd);
		if(itemInd >= 0){
			let itemName = user.inven[itemInd].name;
      console.log(itemName);
			switch(itemName){
				case "복권":
				let [lottMoney, lottMsg] = useLottery();
        user.inven.splice(itemInd,1);
				user.mny += lottMoney;
				res += lottMsg;
				break;
				default:
				res += "그 아이템은 사용할 수 없습니다.";
				break;
			}
		}else {
			res += "그런 아이템이 없습니다."+itemInd;
		}
	}
    bot.reply(message,res);	  
  }
  
  controller.hears(["^([가-힣]+) 사용$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.users.get(message.user, function(err, user){
      useItem(user.info,bot,message);
      controller.storage.users.save(user, function(err, id){console.log("User saved!!");});
    });
  });
  
  function throwItem(world,user,bot,message){
  let res = "";
  if(world && user){
    let itemName = message.param[1];
    let item = user.getItem(itemName);
    if(item){
      console.log("item detected");
      remove(user.inven,item);
      world[user.place].objs.push(item);
      res += `${user.name}님이 ${item.name}을(를) 땅에 버렸습니다.`;
    }
  }
  bot.reply(res);
}
  
  controller.hears(["^([가-힣]+) 버려$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.teams.get(message.team, function(err, team){
      controller.storage.users.get(message.user, function(err, user){
        throwItem(team.world,user.info,bot,message);
        controller.storage.users.save(user, function(err, id){console.log("User saved!!");});
        controller.storage.teams.save(team, function(err, id){console.log("World saved!!");});
      });
    });
  });
  

function pickItem(world,user,bot,message){
  let res = "";
  if(world && user){
    let itemName = message.param[1];
	let item;
	for (var obj in world[user.place].objs){
	  if(world[user.place].objs[obj].name == itemName){
	    item = world[user.place].objs[obj];
		break;
	  }
	}
	if(item){
	  user.inven.push(item);
	  remove(world[user.place].objs,item);
	  res += `${user.name}님이 ${item.name}을(를) 주웠습니다.`;
	}
  }
  bot.reply(res);
}

  controller.hears(["^([가-힣]+) 가져$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.teams.get(message.team, function(err, team){
      controller.storage.users.get(message.user, function(err, user){
        pickItem(team.world,user.info,bot,message);
        controller.storage.users.save(user, function(err, id){console.log("User saved!!");});
        controller.storage.teams.save(team, function(err, id){console.log("World saved!!");});
      });
    });
  });
  function showUserInfo(user,bot,message){
    let res = "";
    if (user){
      res += `=:+:============= [[ *${user.name}* 님의 정보 ]] =============:+:=\n`;
      res +="```\n";
      res += `[레벨] ${user.level} [경험치] ${user.exp.join("/")}\n`;
      res += `[체력] ${user.hp.join("/")} [마력] ${user.mp.join("/")}\n`;
      res += `[스탯] 힘:${user.str} 맷집:${user.sta} 민첩:${user.agi} 지식:${user.int} 집중:${user.con} 운:${user.luk} (수련치:${user.stp})\n`
      res += `[골드] ${user.mny} `;
      res += `[소지아이템수] ${user.inven.length} \n`;
    }
    res += "\n```";
    bot.reply(message,res);
  }
  controller.hears(["^(정보)$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.users.get(message.user, function(err, user){
      showUserInfo(user.info,bot,message);
    });
  });
  
  
  controller.hears(["^(장비)$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.users.get(message.user, function(err, user){
      showEquip(user.info,bot,message);
    });
  });
  
  
  controller.hears(["^([가-힣]+) 벗어$"],userScope,(bot,message) => {
    console.log(message.match[0]);
    controller.storage.users.get(message.user, function(err, user){
      unsetEquip(user.info,bot,message);
      
      controller.storage.users.save(user, function(err, id) {
        console.log("saved");
      });
    });
  });
  
  controller.hears(["^([가-힣]+) 착용$"],userScope,(bot,message) => {
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
      if (message.callback_id.includes(message.user)){
        if (message.callback_id.includes("select_dungeon") ) {
          goDungeon(user.info,bot,message);
        }
        if (message.callback_id.includes("select_item")){
          showItemInfo(user.info,bot,message);
        }
        
        controller.storage.users.save(user, function(err, id) {
          console.log("");
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
         console.log(obj2);
      }
    }
  });
});
  
  
controller.hears(['^(.+)$'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
  console.log(message.user+":"+message.match[0]);
});
}