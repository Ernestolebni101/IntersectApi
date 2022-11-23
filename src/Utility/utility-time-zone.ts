export class Time {
  public static formatAMPM(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const shortMin = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + shortMin + ' ' + ampm;
    return strTime;
  }

  /**
   *
   * @param current_date Fecha y hora actual
   * @param offsetUTC  Escala de la zona horaria
   * @param opts opciones de formato => F: formato con fecha  T: Para obtener el tiempo y la hora
   * por defecto se asigna T para solo la hora
   * @returns
   */
  public static getCustomDate(
    current_date: Date,
    opts = 'T',
    offsetUTC: any = -6,
  ): string {
    // now you need to get UTC time in msec
    const utc_time =
      current_date.getTime() + current_date.getTimezoneOffset() * 60000;

    // create instance of several cities
    const new_date_instance = new Date(utc_time + 3600000 * offsetUTC);
    let localDate: string;
    // in this step you have to return time as a string
    switch (opts) {
      case 'T':
        localDate = Time.formatAMPM(new_date_instance);
        break;
      case 'F':
        localDate = new_date_instance
          .toLocaleString()
          .split(',')[0]
          .toString()
          .trim();
        break;
      case 'long':
        localDate = new_date_instance.toDateString();
        break;
      default:
        break;
    }
    return localDate;
  }
  public static formatting(str: string): string {
    const array = str.split(',');
    const formatted = array[1].toString().trim();
    return formatted;
  }
  /**
   * Date Time For Google Calendar
   * @returns
   */
  public static dateTimeForCalendar = () => {
    const current_date = new Date();
    const utc_time =
      current_date.getTime() + current_date.getTimezoneOffset() * 60000;
    const event = new Date(utc_time + 3600000 * -6);

    const startDate = event;
    // Delay in end time is 1
    const endDate = new Date(
      new Date(startDate).setHours(startDate.getHours() + 1),
    );
    return {
      start: startDate,
      end: endDate,
    };
  };
}
