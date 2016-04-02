import moment from 'moment';
import { Filter } from '../entities';

export default class calendar extends Filter {
  filter(time) {
    if (!time) return;

    return moment(time).calendar(null, {
      lastDay : '[Yesterday]',
      sameDay : 'LT',
      lastWeek : 'dddd',
      sameElse : 'DD/MM/YY'
    });
  }
}