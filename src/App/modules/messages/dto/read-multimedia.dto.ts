export class MultimediaDto {
  public id: string;
  public groupId: string;
  public messageId: string;
  public messageContent: string;
  public messageType: string;
  public fileType: string; // tipo de archivo
  public mediaUrl: Array<string> = []; // Url del archivo
  public messageFrom: string; // Nombre de la persona que lo envio
  public sendDate: string; // Fecha de envio formatead
}
