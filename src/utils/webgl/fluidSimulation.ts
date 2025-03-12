
import { WebGLContext, FrameBuffer, ExtensionFormats } from './types';
import { Program } from './webglUtils';

// Render to a framebuffer
export function blit(gl: WebGLContext, destination: WebGLFramebuffer | null) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

// Add a splat to the simulation
export function addSplat(
  gl: WebGLContext,
  splatProgram: Program,
  canvas: HTMLCanvasElement,
  density: any,
  velocity: any,
  x: number,
  y: number,
  dx: number,
  dy: number,
  color: { r: number, g: number, b: number },
  SPLAT_RADIUS: number,
  dyeWidth: number,
  dyeHeight: number,
  simWidth: number,
  simHeight: number
) {
  splatProgram.bind();
  
  gl.uniform1i(splatProgram.uniforms.uTarget, 0);
  gl.uniform1f(splatProgram.uniforms.uAspectRatio, canvas.width / canvas.height);
  gl.uniform2f(splatProgram.uniforms.uPoint, x / canvas.width, 1.0 - y / canvas.height);
  gl.uniform3f(splatProgram.uniforms.uColor, color.r, color.g, color.b);
  gl.uniform1f(splatProgram.uniforms.uRadius, SPLAT_RADIUS);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, density.read.texture);
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
  gl.viewport(0, 0, dyeWidth, dyeHeight);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  density.swap();
  
  gl.uniform1i(splatProgram.uniforms.uTarget, 0);
  gl.uniform3f(splatProgram.uniforms.uColor, dx, dy, 0);
  gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
  gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
  gl.viewport(0, 0, simWidth, simHeight);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  velocity.swap();
}

// Setup vertex array for WebGL 2 or via extension for WebGL 1
export function setupVertexArray(gl: WebGLContext) {
  let vertexArray = null;
  
  // Check if createVertexArray is available (WebGL2)
  if (typeof gl.createVertexArray === 'function') {
    vertexArray = gl.createVertexArray();
    gl.bindVertexArray(vertexArray);
  } 
  // Try to use the extension for WebGL1
  else {
    const ext = gl.getExtension('OES_vertex_array_object');
    if (ext) {
      vertexArray = ext.createVertexArrayOES();
      ext.bindVertexArrayOES(vertexArray);
    }
  }
  
  return vertexArray;
}

// Run a simulation step
export function stepSimulation(
  gl: WebGLContext,
  advectionProgram: Program,
  displayProgram: Program,
  velocity: any,
  density: any,
  dt: number,
  texelSize: number[],
  dyeWidth: number,
  dyeHeight: number,
  simWidth: number,
  simHeight: number,
  VELOCITY_DISSIPATION: number,
  DENSITY_DISSIPATION: number,
  canvas: HTMLCanvasElement
) {
  // Advect velocity
  advectionProgram.bind();
  gl.uniform2f(advectionProgram.uniforms.texelSize, texelSize[0], texelSize[1]);
  gl.uniform1i(advectionProgram.uniforms.uVelocity, 0);
  gl.uniform1i(advectionProgram.uniforms.uSource, 0);
  gl.uniform1f(advectionProgram.uniforms.uDeltaT, dt);
  gl.uniform1f(advectionProgram.uniforms.uDissipation, VELOCITY_DISSIPATION);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
  gl.bindFramebuffer(gl.FRAMEBUFFER, velocity.write.fbo);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, simWidth, simHeight);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  velocity.swap();
  
  // Advect density
  gl.uniform1i(advectionProgram.uniforms.uVelocity, 0);
  gl.uniform1i(advectionProgram.uniforms.uSource, 1);
  gl.uniform1f(advectionProgram.uniforms.uDissipation, DENSITY_DISSIPATION);
  
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, velocity.read.texture);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, density.read.texture);
  gl.bindFramebuffer(gl.FRAMEBUFFER, density.write.fbo);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.viewport(0, 0, dyeWidth, dyeHeight);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  density.swap();
  
  // Display result
  gl.viewport(0, 0, canvas.width, canvas.height);
  displayProgram.bind();
  gl.uniform1i(displayProgram.uniforms.uTexture, 0);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, density.read.texture);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
