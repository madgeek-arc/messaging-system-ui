export class Correspondent {
  name:	string;
  email:	string;
  groupId:	string;

  constructor() {
    this.name = null;
    this.email = null;
    this.groupId = null;
  }
}

export class Message {
  id: string;
  from:	Correspondent;
  to: [Correspondent];
  body:	string;
  date:	string;
  read: boolean;
  readDate: string;


  constructor() {
    this.id = null;
    this.from = null;
    this.to = null;
    this.body = null;
    this.date = null;
    this.read = null;
    this.readDate = null;
  }
}

export class TopicThread {
  id:	string;
  subject:	string;
  tags:	string[];
  from:	Correspondent;
  to:	[Correspondent];
  messages:	Message[];
  created:	string;
  updated:	string;

  constructor() {
    this.id = null;
    this.subject = null;
    this.tags = [];
    this.from = new Correspondent();
    this.to = [new Correspondent()];
    this.messages = [new Message()];
    this.messages[0].from = new Correspondent();
    this.messages[0].to = [new Correspondent()];
    this.created = null;
    this.updated = null;
  }
}
