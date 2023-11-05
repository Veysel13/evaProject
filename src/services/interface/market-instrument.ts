import { MarketInstrumentDoc } from "../../models/market-instrument"
export interface InterfaceMarketInstrument {
    gets(query:Object):Promise<MarketInstrumentDoc[]>,
    isAvailable(id: string,stock:number):Promise<boolean>
  }