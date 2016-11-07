import {map_vid} from './constant'

export function create_image(src: string): Promise<HTMLImageElement> {
    const img = <HTMLImageElement>document.createElement('img');
    img.src = src;
    return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}

export interface BoundingBox {
    height: number;
    width: number;
    x: number;
    y: number;
    name: string;
}

export function parseBox(xml: XMLDocument, canvas_width: number, canvas_height: number): BoundingBox {
    const queryint = query => parseInt(xml.querySelector(query).textContent);
    const xmax = queryint('object xmax');
    const xmin = queryint('object xmin');
    const ymax = queryint('object ymax');
    const ymin = queryint('object ymin');
    const height = queryint('size height');
    const width = queryint('size width');
    const name = map_vid.get(xml.querySelector('name').textContent);
    const scalex = canvas_width / width;
    const scaley = canvas_height / height;
    return {
        height: (ymax - ymin) * scaley,
        width: (xmax - xmin) * scalex,
        x: xmin * scalex,
        y: ymin * scaley,
        name: name
    };
}
