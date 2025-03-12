
import { Color } from '../webgl/types';

export class Pointer {
  id: number = -1;
  texcoordX: number = 0;
  texcoordY: number = 0;
  prevTexcoordX: number = 0;
  prevTexcoordY: number = 0;
  deltaX: number = 0;
  deltaY: number = 0;
  down: boolean = false;
  moved: boolean = false;
  color: Color = { r: 0, g: 0, b: 0 };
}

export function updatePointerDownData(pointer: Pointer, id: number, posX: number, posY: number, canvasWidth: number, canvasHeight: number) {
  pointer.id = id;
  pointer.down = true;
  pointer.moved = false;
  pointer.texcoordX = posX / canvasWidth;
  pointer.texcoordY = 1.0 - posY / canvasHeight;
  pointer.prevTexcoordX = pointer.texcoordX;
  pointer.prevTexcoordY = pointer.texcoordY;
  pointer.deltaX = 0;
  pointer.deltaY = 0;
}

export function updatePointerMoveData(pointer: Pointer, posX: number, posY: number, canvasWidth: number, canvasHeight: number, color: Color) {
  pointer.prevTexcoordX = pointer.texcoordX;
  pointer.prevTexcoordY = pointer.texcoordY;
  pointer.texcoordX = posX / canvasWidth;
  pointer.texcoordY = 1.0 - posY / canvasHeight;
  pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX, canvasWidth, canvasHeight);
  pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY, canvasWidth, canvasHeight);
  pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
  pointer.color = color;
}

export function correctDeltaX(delta: number, width: number, height: number): number {
  let aspectRatio = width / height;
  if (aspectRatio < 1) delta *= aspectRatio;
  return delta;
}

export function correctDeltaY(delta: number, width: number, height: number): number {
  let aspectRatio = width / height;
  if (aspectRatio > 1) delta /= aspectRatio;
  return delta;
}
