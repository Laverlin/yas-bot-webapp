import { IWayPoint } from "./IWayPoint";

export interface IYasRoute {
    RouteId: number,
    UserId: number,
    RouteName: string,
    RouteDate: Date,
    WayPoints: IWayPoint[] 
}
