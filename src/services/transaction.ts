import { Transaction } from "../models/transaction";


export class TransactionService {

  async store(user_id: string,market_instrument_id:string,type:string,stock:number,price:number) {
    
    const transaction = Transaction.build({user_id:Object(user_id),market_instrument_id:Object(market_instrument_id),type,stock,price});
    await transaction.save()

    return true;
  }
}
