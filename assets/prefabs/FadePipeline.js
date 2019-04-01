/**
 *
 */
class FadePipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
    
    constructor(game, renderer) {

        var vs = `
            precision mediump float;

            uniform mat4 uProjectionMatrix;
            uniform mat4 uViewMatrix;
            uniform mat4 uModelMatrix;

            attribute vec2 inPosition;
            attribute vec2 inTexCoord;

            varying vec2 vTexCoord;

            void main () 
            {
                gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(inPosition, 1.0, 1.0);

                vTexCoord = inTexCoord;
            }`;

        var fs = `
            precision mediump float;

            uniform sampler2D uMainSampler;

            varying vec2 vTexCoord;

            void main()
            {
                vec4 texture = texture2D(uMainSampler, vTexCoord);

                // texture = mix(texture, vec4(texture.rgb, 0.0), 0.1);
                if (texture.a > 0.0)
                    texture.rgba -= 0.005;

                gl_FragColor = texture;
            }`;


        super({
            game: game,
            renderer: renderer,
            vertShader: vs,
            fragShader: fs
        });

        this.attributes = [
         {
             name: 'inPosition',
             size: 2,
             type: this.renderer.gl.FLOAT,
             normalized: false,
             offset: 0
         },
         {
             name: 'inTexCoord',
             size: 2,
             type: this.renderer.gl.FLOAT,
             normalized: false,
             offset: Float32Array.BYTES_PER_ELEMENT * 2
         }
        ];

    }
}

