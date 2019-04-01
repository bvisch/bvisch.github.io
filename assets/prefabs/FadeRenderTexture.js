/**
 *
 */
class FadeRenderTexture extends Phaser.GameObjects.RenderTexture {
    
    constructor(scene, x, y, width, height, cursors) {
        super(scene, x, y, width, height);

        this.cursors = cursors;

        var gl = this.gl;

        if (gl) {
            this.overwriteBlendMode = this.renderer.addBlendMode([gl.ONE, gl.ZERO], gl.FUNC_ADD);

            this.texture2 = scene.sys.textures.createCanvas('texture2', width, height);
            this.frame2 = this.texture2.get();

            this.fadePipeline = new FadePipeline(scene.sys.game, scene.sys.game.renderer);
            this.framebuffer2 = this.renderer.createFramebuffer(width, height, this.frame2.source.glTexture, false);
        }
    }

    draw(entries, x, y, alpha, tint) {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        if (alpha === undefined) { alpha = this.globalAlpha; }

        if (tint === undefined) {
            tint = (this.globalTint >> 16) + (this.globalTint & 0xff00) + ((this.globalTint & 0xff) << 16);
        }
        else {
            tint = (tint >> 16) + (tint & 0xff00) + ((tint & 0xff) << 16);
        }

        if (!Array.isArray(entries)) {
            entries = [ entries ];
        }

        var gl = this.gl;

        this.camera.preRender(1, 1);

        if (gl) {
            var cx = this.camera._cx;
            var cy = this.camera._cy;
            var cw = this.camera._cw;
            var ch = this.camera._ch;

            var pipeline = this.pipeline;
            var fadePipeline = this.fadePipeline;
            var blendMode = this.renderer.currentBlendMode;
            this.renderer.setBlendMode(this.overwriteBlendMode);

            this.renderer.setFramebuffer(this.framebuffer, false);
            this.renderer.pushScissor(cx, cy, cw, ch, ch);

            // fade texture2 into texture1
            fadePipeline.projOrtho(0, this.width, 0, this.height, -1000.0, 1000.0);
            fadePipeline.batchTextureFrame(this.frame2, x, y, tint, alpha, this.camera.matrix, null);
            fadePipeline.flush();

            // draw to texture1
            this.renderer.setPipeline(pipeline);
            pipeline.projOrtho(0, this.width, 0, this.height, -1000.0, 1000.0);
            this.batchList(entries, x, y, alpha, tint);
            pipeline.flush();

            // reset everything
            this.renderer.setFramebuffer(null, false);
            this.renderer.popScissor();
            pipeline.projOrtho(0, pipeline.width, pipeline.height, 0, -1000.0, 1000.0);
            fadePipeline.projOrtho(0, fadePipeline.width, fadePipeline.height, 0, -1000.0, 1000.0);
            this.renderer.setBlendMode(blendMode);

            // swap textures and framebuffers for the next draw
            var tempTexture = this.frame;
            this.frame = this.frame2;
            this.frame2 = tempTexture;

            var tempFramebuffer = this.framebuffer;
            this.framebuffer = this.framebuffer2;
            this.framebuffer2 = tempFramebuffer;
        }
        else {
            this.renderer.setContext(this.context);

            this.batchList(entries, x, y, alpha, tint);

            this.renderer.setContext();
        }

        this.dirty = true;

        return this;
    }
}

