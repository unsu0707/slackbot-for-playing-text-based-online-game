module.exports = function(controller) {
const botScope = [
   'direct_message',
   'direct_mention',
   'mention',
   'ambient'
];
var weapon_list = ["나뭇가지","목검","롱소드","버스터소드","본블레이드","용골대검","선더블레이드","자그라스블레이드","기르오스블레이드","블룸블레이드","크롬레이저소드","마라드하디드소드","강빙대검","용의아기토","멸혼의흉기"];
var user_info = [
{			id: "U2KEXDWC8",
			name: "김진지",
			weapon: {name: "김진지의 버스터소드", lev: 7, atk: 1, grd: 7},
			rage: 0,
			mode: 4,
			hp: 502,
			mhp: 502,
			sp: 100,
			msp: 100,
			type: 1,
			gold: 201370},
{			id: "U2KFZEC93",
			name: "뽀로리",
			weapon: {name: "뽀로리의 롱소드", lev: 1, atk: 1, grd: 6},
			rage: 0,
			mode: 0,
			hp: 459,
			mhp: 459,
			sp: 100,
			msp: 100,		
			gold: 57656},
{			id: "U76DX1AE6",
			name: "히바리가오카",
			weapon: {name: "히바리가오카의 버스터소드", lev: 1, atk: 1, grd: 8},
			rage: 0,
			mode: 4,
			hp: 559,
			mhp: 607,
			sp: 100,
			msp: 100,		
			gold: 127411},
{			id: "U2KGQEKQ8",
			name: "엔터스",
			weapon: {name: "엔터스의 롱소드", lev: 6, atk: 1, grd: 8},
			rage: 0,
			mode: 0,
			hp: 611,
			mhp: 611,
			sp: 100,
			msp: 100,		
			gold: 44317},
{			id: "U37GVQVNE",
			name: "우주전사",
			weapon: {name: "우주전사의 나뭇가지", lev: 2, atk: 1, grd: 0},
			rage: 0,
			mode: 0,
			hp: 100,
			mhp: 100,
			sp: 100,
			msp: 100,		
			gold: 10000},
{			id: "U2KFE1R3L",
			name: "쇼남",
			weapon: {name: "쇼남의 목검", lev: 4, atk: 1, grd: 1},
			rage: 0,
			mode: 0,
			hp: 164,
			mhp: 164,
			sp: 100,
			msp: 100,	
			gold: 10000}
];
var attacker_id = "";
var jackpot = 15120;
function init_user(uid,str){
	var weapon_name = weapon_list[0];
	//var armor_name = armor_level[0];
	var new_user = {
			id: uid,
			name: str,
			weapon: {name: str+"의 "+weapon_name, lev: 0, atk: 1, grd: 0},
			rage: 0,
			mode: 0,
			hp: 100,
			mhp: 100,
			sp: 100,
			msp: 100,			
			gold: random(10000)
	};
	return new_user;
}
function get_weapon_name(wpn_grd){
	return weapon_list[wpn_grd];
}
function user_ind(userid){
	var ind = -1;
	for(var i=0;i<user_info.length;i++){
		if(user_info[i].id == userid){
			ind = i;
			break;
		}
	}
	return ind;
}
function random(num){
	var rnd = Math.round(Math.random() * num);
	return rnd+1;
}
function checkAlive(user){
	return (user.hp == 0)?true:false;
}
function cannot_find_user_msg(){
	return "생성된 무기를 찾을 수 없습니다. `!강화게임 (유저이름)`으로 게임을 시작해보세요.";
}
function print_prpt(user){
	var str = "";
	str += "["+user.name+":"+user.hp+"/"+user.mhp+","+user.sp+"/"+user.msp+"] ";
	return str;
}
controller.hears(['\!공격 ([ㄱ-ㅎㅏ-ㅣ가-힣0-9a-zA-Z\.,_]+)'],botScope,(bot,message) => {
	var uind = user_ind(message.user);	
	var tind = -1;
	var msg = "";
	if(uind == -1){
		msg = cannot_find_user_msg;		
	}else{
		cure_sp(uind);
		msg += print_prpt(user_info[uind]);
		if(attacker_id == user_info[uind].id && 1 == 0){
			msg = "한명이 계속 공격할 수 없습니다.";
		}else{
		if(checkAlive(user_info[uind])){
			msg += "HP가 0이어서 아무것도 할 수 없습니다. `!회복`으로 회복하세요.";
		}else {
		for(var i=0;i<user_info.length;i++){
			if(user_info[i].name == match[1]){
				tind = i;
				break;
			}
		}		
		if(tind == -1){
			msg = "[공격 실패!] 그런 이름을 가진 대상을 찾을 수 없습니다."
		}else{
			if(uind == tind && 0 == 1){
				msg += "[공격 실패!] 자기 자신을 공격할 수 없습니다.";
			}else{
				attacker_id = user_info[uind].id;
				var me = user_info[uind];
				var you = user_info[tind];
				if(you.hp>0){
					msg += "[ *"+me.name+"* ---> "+you.name+" 을 향해 공격!] ";
					var percent = 80;					
					var myatk = me.weapon.grd*me.weapon.grd*10+me.weapon.lev*3;
					var yratk = you.weapon.grd*you.weapon.grd*10+you.weapon.lev*3;
					var dmg = ((myatk-yratk>0)?myatk-yratk:random(5))+random(5);
					if (myatk>=yratk){
						percent += random(20) + dmg/myatk*50;
					}
					console.log(percent+"% dmg : "+dmg+" "+myatk+"/"+yratk+"");
					if(percent > random(100)){
						var nsp = 40*(dmg/you.mhp);
						nsp = (nsp<4)?4:Math.round(nsp);
						if(user_info[uind].sp <= nsp){
							msg += "스태미나가 부족합니다. `!강화`로 스태미나를 회복하거나, 다른 유저들의 명령을 기다리세요.";
						}
						else{
							user_info[uind].sp -= nsp;
						if( ((me.weapon.grd>you.weapon.grd)?10:5) > random(100))
						{
							dmg = Math.round( dmg * (15+random(5))/10 );
							msg += " `치명타!!` ";
						}
						switch (user_info[tind].mode){
							case 1:
								var rnd = 70 + random(30);
								if(Math.round(dmg * rnd / 100) <= you.gold){
									dmg = Math.round(dmg * rnd / 100);
									msg += " `방어 발동!` "+you.name+"이 골드 "+dmg+"G를 모아붙여 방패를 만듭니다. 데미지 절반! \n";
									you.gold -= dmg;
								} else { 
									msg += " `방어태세 실패!` "+you.name+"이 골드로 방패를 만들려고 하지만 골드가 부족해 실패합니다.\n"
								}
								msg += " "+me.name+"이(가) "+you.name+"을(를) 공격합니다. (HP : "+you.hp+" => ";
								you.hp = (you.hp-dmg>0)?you.hp-dmg:0;
								msg += you.hp+")";	
								break;
							case 2:
								dmg = Math.round(dmg * 1.2);
								msg += " "+me.name+"이(가) "+you.name+"을(를) 공격합니다. (HP : "+you.hp+" => ";
								you.hp = (you.hp-dmg>0)?you.hp-dmg:0;
								msg += you.hp+")";
								if(user_info[tind].mode == 2 && random(100) > 50){
										dmg = (yratk-myatk>0)?yratk-myatk:random(5);
										dmg = Math.round(dmg * 0.8);
										msg += "\n `반격 발동!!` "+you.name+"이(가) "+me.name+"을(를) 공격합니다. (HP : "+me.hp+" => ";
										me.hp = (me.hp-dmg>0)?me.hp-dmg:0;
										msg += me.hp+")";							
								}
								break;
							case 3:
								dmg = Math.round(dmg * 1.4);			
								msg += " "+me.name+"이(가) "+you.name+"을(를) 공격합니다. (HP : "+you.hp+" => ";
								you.hp = (you.hp-dmg>0)?you.hp-dmg:0;
								msg += you.hp+")";	
								var get_rage = Math.round(dmg/2);
								you.rage += get_rage;
								msg += "\n ("+you.name+"의 분노가 쌓입니다.. ㅂㄷㅂㄷ )"
								if(you.rage>you.mhp) you.rage=you.mhp;
								if((you.rage > you.mhp/2 && random(100) > 60) || you.rage >= you.mhp){
									msg += "\n `분노 발동!` "+you.name+"이(가) 참다참다 "+me.name+"의 멱살을 잡고 공격합니다. (HP : "+me.hp+" => ";
									me.hp = (me.hp-you.rage>0)?me.hp-you.rage:0;
									msg += me.hp+")";
									you.rage = 0;
								}
								break;
							case 4:
								dmg = Math.round(dmg * 1.2);
								msg += " "+me.name+"이(가) "+you.name+"을(를) 공격합니다. (HP : "+you.hp+" => ";
								you.hp = (you.hp-dmg>0)?you.hp-dmg:0;
								msg += you.hp+")";	
								if (random(100) > 50){
									var get_gold = dmg*(20*random(20));
									get_gold *= (me.grd-you.grd>0)?me.grd-you.grd:1;
									get_gold *= (me.grd-you.grd>0)?me.grd-you.grd:1;
									if(me.gold < get_gold) get_gold = me.gold;
									msg += "\n `도벽 발동!` "+you.name+"이(가) 공격 직전 당신의 주머니에서 골드를 훔쳐갑니다. (-"+get_gold+"G )"
									me.gold -= get_gold;
									you.gold += get_gold;
								}
								break;
							default:
								msg += " "+me.name+"이(가) "+you.name+"을(를) 공격합니다. (HP : "+you.hp+" => ";
								you.hp = (you.hp-dmg>0)?you.hp-dmg:0;
								msg += you.hp+")";	
								break;								
							}		
							msg += "(스태미나 "+nsp+" 소모)";
						}						
					}else{
						msg += " *공격 실패!* 아무 일도 일어나지 않았습니다.";
						if(user_info[tind].mode == 2 && random(100) > 20){
							    dmg = (yratk-myatk>0)?yratk-myatk:random(5);
								dmg = Math.round(dmg * 0.8);
								msg += "\n `반격 발동!!` "+you.name+"이(가) "+me.name+"을(를) 공격합니다. (HP : "+me.hp+" => ";
								me.hp = (me.hp-dmg>0)?me.hp-dmg:0;
								msg += me.hp+")";							
						}
					}
				}else{
					msg += "야메떼! "+you.name+"의 HP는 이미 0이야!";
				}
			}
		}
		}
		}
	}
	bot.reply(message,msg);
});
controller.hears(['\!(도움|헬프|도움말|명령어|명령|커맨드)'],botScope,(bot,message) => {
	var msg = "```\n!강화게임시작 : 게임을 시작합니다.\n"+
"!강화 : 무기를 강화합니다.\n"+
"!상황/!리스트 : 현재 전체 상황을 봅니다.\n"+
"!노가다/!돈벌기/!알바 : 강화에 필요한 돈을 획득합니다.\n"+
"!복권 : 1000골드를 이용해 복권을 긁습니다.\n"+
"!공격 (유저명) : 유저에게 공격을 가할 수 있습니다. 공격을 당해 HP가 줄어든 유저는 강화 확률이 낮아집니다.\n"+
"!회복 : 낮아진 HP를 골드를 사용해 회복합니다.\n"+
"!태세 (방어/일반/반격/분노/도벽) : 태세를 전환합니다.\n```";
	bot.reply(message,msg);
});

controller.hears(['\!태세 (방어|일반|반격|분노|도벽)'],botScope,(bot,message) => {
	var uind = user_ind(message.user);
	var msg = "";
	if(uind == -1){
		msg = cannot_find_user_msg;
	}else{
		if(match[1] =="방어"){
			msg += "방어 태세로 전환합니다. 데미지가 0.5배로 줄어들고, 줄어든 데미지만큼 골드가 소모됩니다. 골드를 모두 소모시 적용되지 않습니다.";
			user_info[uind].mode = 1;
		}else if(match[1] == "반격"){
			msg += "반격 태세로 전환합니다. 데미지를 1.2배 받고, 공격자의 공격이 실패시 본인이 0.8배의 데미지로 반격합니다.";
			user_info[uind].mode = 2;			
		}else if(match[1] == "분노"){
			msg += "분노 태세로 전환합니다. 데미지를 1.4배 받은 후 비례되는 분노게이지가 쌓이고, 그 분노게이지가 자신의 최대HP를 초과할 경우 공격자에게 반격합니다.";
			user_info[uind].mode = 3;
		}else if(match[1] == "도벽"){
			msg += "도벽 태세로 전환합니다. 적의 공격이 성공시 데미지를 1.2배 받되, 일정 확률로 적의 골드를 데미지 비례로 뺏어옵니다.";
			user_info[uind].mode = 4;
		}else{
			msg += "일반 태세로 전환합니다.";
			user_info[uind].mode = 0;
			
		}
	}
	bot.reply(message, msg);	
});

controller.hears(['\!강화게임시작'],botScope,(bot,message) => {
	var uind = user_ind(message.user);	
	if(uind == -1){
		bot.startConversation(message, function (err, convo) {
			convo.ask('유저명을 알려주세요. (한글/영문/숫자/./,/_ 만 사용 가능)', [
				{
					pattern: '([ㄱ-ㅎㅏ-ㅣ가-힣0-9a-zA-Z\.,_]+)', 
					callback: function (response, convo) {
						var len = user_info.length;
						var user_name = match[1];
						for (var i=0;i<len;i++){
							if(user_name == user_info[i].name){								
								convo.say("같은 이름의 유저가 존재합니다.");
								convo.repeat(); // convo.repeat()で、質問を繰り返します。
								convo.next(); // 会話を次に進めます。この場合、最初の質問にも戻ります。
								break;
							}
						}
						user_info[len] = init_user(response.user,user_name);
						convo.say("`+0 "+get_weapon_name(user_info[len].weapon.grd)+"` 가 지급되었습니다. 강화게임을 시작합니다. (현재 소지금 : 10000) (!강화 / !돈벌기 / !상황 / !복권 / !전체리스트)");
						convo.next();
					}
				},
				{
					default: true,
					callback: function (response, convo) {
						convo.repeat(); // convo.repeat()で、質問を繰り返します。
						convo.next(); // 会話を次に進めます。この場合、最初の質問にも戻ります。
					}
				}
			]);
		});
	}else{
		bot.reply(message, "이미 무기가 등록되어 있습니다.");
	}
});
controller.hears(['\!변경 ([^ ]+) ([^ ]+) ([^ ]+)'],botScope,(bot,message) => {
	
	var uind = user_ind(message.user);
	var msg = "";
	if(uind == -1){
		msg = cannot_find_user_msg;
	}else{
		msg += print_prpt(user_info[uind]);
		user = user_info[uind];
		if(user.type == 1){
			for(var i=0;i<user_info.length;i++){
				if(user_info[i].name == match[1]){
					tind = i;
					break;
				}
			}		
			if(tind == -1){
				msg += "[실패!] 그런 이름을 가진 대상을 찾을 수 없습니다."
			}else{
				param = match[2];
				value = parseInt(match[3]);
				switch(param){
					case "체력":
						user_info[tind].hp = value;
						user_info[tind].mhp = value;
						msg += user_info[tind].name+"님의 "+param+"이 변경되었습니다.";
					break;
					case "스태미나":
						user_info[tind].sp = value;
						user_info[tind].msp = value;
						msg += user_info[tind].name+"님의 "+param+"이 변경되었습니다.";
					break;
					case "돈":
						user_info[tind].money = value;
						msg += user_info[tind].name+"님의 "+param+"이 변경되었습니다.";
					break;					
					default:
						msg += "그런 스탯이 없습니다.";
				}
			}
		} else {
			msg += "그런 권한이 없습니다."
		}
	}
});
controller.hears(['\!강화'],botScope,(bot,message) => {
	var uind = user_ind(message.user);
	var msg = "";
	if(uind == -1){
		msg = cannot_find_user_msg;
	}else{
		cure_sp(uind);
		msg += print_prpt(user_info[uind]);
		if(checkAlive(user_info[uind])){
			msg += "HP가 0이어서 아무것도 할 수 없습니다. `!회복`으로 회복하세요.";
		}else{
			var user_name = user_info[uind].name;
			var hp_stat = user_info[uind].hp/user_info[uind].mhp;
			var max_p = Math.round(hp_stat*100);
			if(max_p <= 90){
				msg += "[강화 확률은 현재 HP에 비례합니다. 현재 HP가 너무 낮습니다. `!회복` 으로 HP관리하세요. ]\n";
				if(max_p < 30) max_p = 30;
			}
			var percent = random(100);
			var wpn = user_info[uind].weapon;
			var price = (wpn.grd)*(wpn.grd)*1000+(wpn.lev+1)*(200*wpn.grd);
			var target_percent = Math.round((wpn.grd/3*10+wpn.lev/2*5)*100)/100;
			target_percent = max_p - target_percent;
			if (target_percent < 3) target_percent=3;
			if(price <= user_info[uind].gold){
				user_info[uind].sp = (user_info[uind].sp+30<=user_info[uind].msp)?user_info[uind].sp+30:user_info[uind].msp;
				user_info[uind].gold -= price;
				msg += " `비용:"+price+"G, 확률:"+target_percent+"%` ";
				
				if(percent <= target_percent){
					if(wpn.lev+1 >= 5+Math.round(wpn.grd/2)*2){
						wpn.grd++;
						wpn.lev = 0;
						var tmp_mhp = user_info[uind].mhp;
						user_info[uind].mhp += 50+random(5)*3+random(10);
						user_info[uind].hp = Math.round((user_info[uind].hp/tmp_mhp) * user_info[uind].mhp);
						msg += "\n[무기 진화!] 최대레벨 도달로 `+0 "+get_weapon_name(wpn.grd)+"` 이 되었습니다. 최대HP가 "+tmp_mhp+" => "+user_info[uind].mhp+"로 증가합니다.";
					}else{						
						msg += "[강화 성공!] `+"+wpn.lev;
						wpn.lev += 1;
						msg += "` → `+"+wpn.lev+" "+get_weapon_name(wpn.grd)+"`";
					}
				}else{
					var minus_lev = random(2);
					msg += "[강화 실패..] +"+wpn.lev;
					wpn.lev -= minus_lev;
					if(wpn.lev<0) wpn.lev = 0;
					msg += " → `+"+wpn.lev+" "+get_weapon_name(wpn.grd)+"`";
				}
			} else {
				msg += user_name+"님, 강화비용 "+price+"G가 없습니다. ";
			}
		}
		msg += " (현재 소지금: "+user_info[uind].gold+" G)";
	}
	bot.reply(message,msg);
});
controller.hears(['\!회복'],botScope,(bot,message) => {
	var uind = user_ind(message.user);
	var msg = ""
	if(uind == -1){
		msg += cannot_find_user_msg;
	}else{
		cure_sp(uind);
		msg += print_prpt(user_info[uind]);
		if (user_info[uind].mhp > user_info[uind].hp){
			var uname = user_info[uind].name;
			var rank = 0;
			var danga = (10+user_info[uind].weapon.grd*10+user_info[uind].weapon.lev*2);
			var nhp = (user_info[uind].mhp-user_info[uind].hp);
			if(user_info[uind].gold < nhp*danga ){
				nhp = Math.round(user_info[uind].gold/danga)-1;
			}
			if (nhp >= 1){
				var price = nhp*danga;
				var award = 0;
				msg += "["+nhp+"HP 회복 비용 "+price+"G] "
				if (user_info[uind].gold >= price){
					msg += "HP를 회복 하였습니다. ("+(user_info[uind].hp)+"/"+user_info[uind].mhp+") => ("+(user_info[uind].hp+nhp)+"/"+user_info[uind].mhp+")";
					user_info[uind].gold -= price;
					user_info[uind].hp += nhp;
				}
			}else{
				msg += "회복 비용이 부족합니다.";
			}
		}else{
			msg += "체력이 이미 만땅입니다.";
		}
		msg += " (현재 소지금: "+user_info[uind].gold+" G)";
	}
	bot.reply(message,msg);
});
function cure_sp(uind){
	var len = user_info.length;
	for (var i=0;i<len;i++){
		if(user_info[i].sp+1 <= user_info[i].msp/3 && uind != i){
			user_info[i].sp++;
		}
	}
}
setInterval(cure_sp,5000);
controller.hears(['\!(돈벌기|노가다|알바)'],botScope,(bot,message) => {
	var uind = user_ind(message.user);
	var gold = 100*random(20);
	var msg = "";
	if(uind == -1){
		msg += "생성된 무기를 찾을 수 없습니다. `!강화게임 (유저이름)`으로 게임을 시작해보세요.";
	}else{
		cure_sp(uind);
		msg += print_prpt(user_info[uind]);
		if(user_info[uind].sp >= 5){
			user_info[uind].sp=(user_info[uind].sp-5>=0)?user_info[uind].sp-5:0;
			var uname = user_info[uind].name;
			gold += user_info[uind].weapon.lev*random(50)+user_info[uind].weapon.grd*random(1000);
			user_info[uind].gold += gold;
			msg += user_info[uind].name+"님, 노가다를 해서 돈을 벌었습니다. +"+gold+"G ";
			msg += " (현재 소지금: "+user_info[uind].gold+" G)";
		}else{
			msg += "스태미나가 부족합니다. `!강화` 하거나 다른 사람들의 커맨드를 기다리세요.";
		}
	}
	bot.reply(message,msg);
});
controller.hears(['^([ㄱ-ㅎㅏ-ㅣ가-힣0-9a-zA-Z \.,?]+)$'],botScope,(bot,message) => {
	var uind = user_ind(message.user);
	if(uind != -1){
		var price = ((match[1].length > 100)?100:match[1].length) * 10;
		user_info[uind].gold += price;
		console.log(user_info[uind].name+" USER EARNED "+price+" GOLD");
	}
});
controller.hears(['\!(복권|로또|복권구매|도박)'],botScope,(bot,message) => {
	var uind = user_ind(message.user);
	var msg = ""
	if(uind == -1){
		msg += "생성된 무기를 찾을 수 없습니다. `!강화게임 (유저이름)`으로 게임을 시작해보세요.";
	}else{
		cure_sp(uind);
		msg += print_prpt(user_info[uind]);
		var uname = user_info[uind].name;
		var rank = 0;
		var price = 1000;
		var award = 0;
		var rate = 1 + (user_info[uind].weapon.grd*user_info[uind].weapon.grd)/20;
		price *= rate;
		if (user_info[uind].gold >= price){
			user_info[uind].gold -= price;
			msg += "복권을 "+price+"G에 구매했습니다. 긁어봅니다 => `";
			var percent = random(10000);
			msg += "["+percent+"]번. ";
			if (percent > 9980){
					msg += "잭팟이 터졌습니다!!!!!!!!!!!!!!!!!!!!!!!";
					award = jackpot;
					jackpot = 0;
			}else if (percent > 9950){
					msg += "왕대박! 1등 당첨!!!!! 빰빠빰빠빰";
					award = 50000+10000*random(5);
			}else if (percent > 9900){
					msg += "대박! 2등 당첨!!!";
					award = 20000+1000*random(30);
			}else if (percent > 9750){
					msg += "중박! 3등 당첨!!";
					award = 5000+500*random(20);
			}else if (percent > 9500){
					msg += "소박.. 4등 당첨^^";
					award = 2000+300*random(10);
			}else if (percent > 8800){
					msg += "5등..ㅠㅠ 불쌍하니까.. 이만큼만 드릴게요.";
					award = 1000+300*random(3);
			}else if (percent > 7500){
					msg += "6등..ㅠㅠ 불쌍하니까.. 이만큼만 드릴게요.";
					award = 500+200*random(3);
			}else{
					jackpot += Math.round (price * 0.9);
					msg += "꽝입니다.. 잭팟기금에 "+Math.round (price * 0.9)+"G가 적립됩니다. (현재 금액 : "+jackpot+"G";						
			}
			award *= rate;
			award = Math.round(award);
			user_info[uind].gold += award;
			msg += "` *+"+award+"G* 획득!";
		}else{
			msg += "복권 가격 "+price+"G가 필요합니다.";
		}
		msg += " (현재 소지금: "+user_info[uind].gold+"G)";
	}
	bot.reply(message,msg);
});

controller.hears(['\!(전체리스트|리스트|상황|상태|목록)'],botScope,(bot,message) => {
	var msg= "";
	for (var i=0;i<user_info.length;i++){
		var wpn = user_info[i].weapon;
		var mode = "일반";
		switch (user_info[i].mode){
			case 1:
				mode = "방어";
				break;
			case 2:
				mode = "반격";
				break;
			case 3:
				mode = "분노";
				break;
			case 4:
				mode = "도벽";
				break;
			break;		
		}
		msg += "["+(i+1)+"] "+user_info[i].name+"["+user_info[i].hp+"/"+user_info[i].mhp+","+user_info[i].sp+"/"+user_info[i].msp+"]: `+"+wpn.lev+" "+get_weapon_name(wpn.grd)+"` ("+wpn.grd+"등급), "+user_info[i].gold+"골드, (태세 : "+mode+")\n";
	}
	if(msg == ""){
		msg = "현재 이용자가 없습니다.  `!강화게임 (유저이름)`으로 첫번째 유저가 되어보세요.";
	}
	bot.reply(message,msg);
});

controller.hears(['\!유저인포'],botScope,(bot,message) => {
	var str = user_info.toString();
	bot.reply(message,str);
});
}