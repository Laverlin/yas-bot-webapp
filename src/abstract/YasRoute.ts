import { IWayPoint } from "./IWayPoint";

export interface IYasRoute {
    RouteId: number,
    userId: number,
    RouteName: string,
    RouteDate: Date,
    wayPoints: IWayPoint[] 
}
