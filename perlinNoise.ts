namespace Math {

    /**
    * Linearly interpolates between a and b by t
    * @param t The interpolation value between the two numbers
    * @param a The start value
    * @param b The end value
    * @returns Value interpolated result between the two numbers
    */
    //% block="lerp|$t between start $a and end $b"
    export function lerp(t: number, a: number, b: number): number {
        return a + t * (b - a);
    }

}

//% color=#16d9c8 icon=""
namespace perlinNoise {

    // --------------------------------- PERLIN NOISE ---------------------------------
    // Perlin Noise https://github.com/keijiro/PerlinNoise/blob/master/Assets/Perlin.cs
    // Thanks Keijiro Takahashi

    const PERMUTATION = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180, 151];


    /**
    * Generate 1D Noise
    * @returns Value between 0.0 and 1.0
    */
    //% block="1D Noise in $x coordinate"
    //% weight=100
    export function noise1d(x: number): number {
        let XF = Math.floor(x) & 0xff;
        x -= Math.floor(x);
        let u = fade(x);
        return 0.5 + Math.lerp(u, grad1d(PERMUTATION[XF], x), grad1d(PERMUTATION[XF + 1], x - 1));
    }


    /**
    * Generate 2D Noise
    * @returns Value between 0.0 and 1.0
    */
    //% block="2D Noise in $x and $y coordinates"
    //% weight=90
    export function noise2d(x: number, y: number): number {
        let XF = Math.floor(x) & 0xff;
        let YF = Math.floor(y) & 0xff;
        x -= Math.floor(x);
        y -= Math.floor(y);
        let u = fade(x);
        let v = fade(y);
        let a = (PERMUTATION[XF] + YF) & 0xff;
        let b = (PERMUTATION[XF + 1] + YF) & 0xff;
        return 0.5 + Math.lerp(
            v,
            Math.lerp(u, grad2d(PERMUTATION[a], x, y), grad2d(PERMUTATION[b], x - 1, y)),
            Math.lerp(u, grad2d(PERMUTATION[a + 1], x, y - 1), grad2d(PERMUTATION[b + 1], x - 1, y - 1))
        );
    }


    /**
    * Generate 1D Perlin noise
    */
    //% block="1D Perlin Noise|in $x|with amplitude $amplitude|frequency $frequency|octaves $octaves|persistence $persistence|lacunarity $lacunarity"
    //% weight=80
    export function fbm1d(x: number, amplitude: number, frequency: number, octaves: number, persistence: number, lacunarity: number): number {
        let value = 0;

        for (let i = 0; i < octaves; i++) {
            value += noise1d(x * frequency) * amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }

        return value;
    }


    /**
    * Generate 2D Perlin noise
    */
    //% block="2D Perlin Noise|in $x and $y|with amplitude $amplitude|frequency $frequency|octaves $octaves|persistence $persistence|lacunarity $lacunarity"
    //% weight=70
    export function fbm2d(x: number, y: number, amplitude: number, frequency: number, octaves: number, persistence: number, lacunarity: number): number {
        let value = 0;

        for (let i = 0; i < octaves; i++) {
            value += noise2d(x * frequency, y * frequency) * amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }

        return value;
    }


    function grad1d(h: number, x: number): number {
        return (h & 1) == 0 ? x : -x;
    }

    function grad2d(h: number, x: number, y: number): number {
        let xx = (h & 1) == 0 ? x : -x;
        let yy = (h & 2) == 0 ? y : -y;

        return xx + yy;
    }

    function fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

}
