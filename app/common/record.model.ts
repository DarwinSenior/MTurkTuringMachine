export type Status = 'Coco' | 'Pascal' | 'Neither' | 'Both';

export interface Record{
    path: string,
    id: number,
    choice: Status
}
