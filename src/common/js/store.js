export function saveToLocal(key,value){
	let app = window.localStorage.__app__;
	if(!app){
		app = {};
		app[key] = value; 
	}else{
		app = JSON.parse(app);
	}
	app[key] = value; 
	window.localStorage.__app__ = JSON.stringify(app);
};

export function loadFromLocal(key,def){
	let app = window.localStorage.__app__;
	if(!app) {
		return def;
	}
	app = JSON.parse(app);
	if(!app){
		return def;
	}
	let ret = app[key];
	return ret || def;
};

export function deleteFromLocal(key){
	let app = window.localStorage.__app__;
	app.removeItem(key);
}
