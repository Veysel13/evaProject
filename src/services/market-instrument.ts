import { MarketInstrument,MarketInstrumentDoc } from "../models/market-instrument";
import { InterfaceMarketInstrument } from "./interface/market-instrument";


export class MarketInstrumentService implements InterfaceMarketInstrument {

  async gets(query: Object) : Promise<MarketInstrumentDoc[]> {
    return await MarketInstrument.find(query);
  }

  async isAvailable(id: string,stock:number):Promise<boolean> {
    
    const marketInstrument = await MarketInstrument.findOne({
        _id: id,
        status: 1,
      });

    if(!marketInstrument || marketInstrument.stock<stock){
        return false;
    }

    return true;
  }
}
