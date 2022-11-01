export class Multimedia {
  constructor(
    public groupId: string,
    public messageId: string,
    public fileType: string, // tipo de archivo
    public messageType: string,
    public mediaUrl: Array<string> = [], // Url del archivo
    public messageFrom: string, // Nombre de la persona que lo envio
    public sendDate: string, // Fecha de envio formatead
    public messageContent: string,
  ) {}
}
// dia mes año
