namespace kortex404Extension {
    export namespace UI {
        const UI_SPRITE_KIND = SpriteKind.create();

        interface CounterOptions {
            x?: number;
            y?: number;
            width?: number;
            height?: number;
            textColor?: number;
            outlineColor?: number;
            backgroundColor?: number;
            backgroundImage?: Image;
        }

        export class Counter {
            private sprite: Sprite;
            private label: string | Image;
            private _value: number;
            private options: CounterOptions;
            private font: image.Font = image.font5;

            constructor(label: string | Image, value: number, options: CounterOptions) {
                this.label = label;
                this._value = value;
                this.options = options;

                this.sprite = sprites.create(image.create(1, 1), UI_SPRITE_KIND);
                this.sprite.setFlag(SpriteFlag.Ghost, true);
                this.sprite.z = 100;
                
                this.redraw();
                
                const x = options.x === undefined ? scene.screenWidth() / 2 : options.x;
                const y = options.y === undefined ? 10 : options.y;
                this.sprite.setPosition(x, y);
            }

            public setValue(v: number) {
                if (this._value !== v) {
                    this._value = v;
                    this.redraw();
                }
            }

            public changeValueBy(v: number) {
                this.setValue(this._value + v);
            }

            private redraw() {
                const valueText = this._value.toString();
                let labelWidth = 0;
                let labelHeight = 0;

                if (typeof this.label === "string") {
                    labelWidth = this.font.charWidth * this.label.length;
                    labelHeight = this.font.charHeight;
                } else {
                    labelWidth = this.label.width;
                    labelHeight = this.label.height;
                }

                const valueWidth = this.font.charWidth * valueText.length;
                const spacing = 2;
                const padding = 4;

                const contentWidth = labelWidth + spacing + valueWidth;
                const contentHeight = Math.max(labelHeight, this.font.charHeight);

                let finalWidth = this.options.width;
                if (finalWidth === undefined) {
                    if (this.options.backgroundImage) finalWidth = this.options.backgroundImage.width;
                    else finalWidth = contentWidth + padding;
                }
                let finalHeight = this.options.height;
                if (finalHeight === undefined) {
                    if (this.options.backgroundImage) finalHeight = this.options.backgroundImage.height;
                    else finalHeight = contentHeight + padding;
                }

                const newImage = image.create(finalWidth, finalHeight);

                if (this.options.backgroundImage) {
                    newImage.drawImage(this.options.backgroundImage, 0, 0);
                } else if (this.options.backgroundColor !== undefined) {
                    newImage.fill(this.options.backgroundColor);
                }

                const contentX = (finalWidth - contentWidth) / 2;
                const contentY = (finalHeight - contentHeight) / 2;
                const textColor = this.options.textColor === undefined ? 1 : this.options.textColor;

                let currentX = contentX;
                if (typeof this.label === "string") {
                    this.printWithOutline(newImage, this.label, currentX, contentY, textColor, this.options.outlineColor);
                    currentX += labelWidth;
                } else {
                    newImage.drawTransparentImage(this.label, currentX, contentY);
                    currentX += labelWidth;
                }

                currentX += spacing;

                this.printWithOutline(newImage, valueText, currentX, contentY, textColor, this.options.outlineColor);

                this.sprite.setImage(newImage);
            }

            private printWithOutline(onImage: Image, text: string, x: number, y: number, color: number, outline?: number) {
                if (outline !== undefined) {
                    const o = outline;
                    onImage.print(text, x - 1, y - 1, o, this.font);
                    onImage.print(text, x + 1, y - 1, o, this.font);
                    onImage.print(text, x - 1, y + 1, o, this.font);
                    onImage.print(text, x + 1, y + 1, o, this.font);
                }
                onImage.print(text, x, y, color, this.font);
            }
        }

        /**
         * Creates a new counter with a text label.
         */
        //% block="set $myCounter to text counter text $text value $value || at pos x $x y $y with size w $width h $height style color $textColor outline $outlineColor bg color $bgColor bg image $bgImage"
        //% group="Create"
        //% blockSetVariable=myCounter
        //% value.defl=0
        //% text.defl="Score:"
        //% expandable=true
        //% inlineInputMode=inline
        //% textColor.shadow=colorindexpicker
        //% textColor.defl=1
        //% outlineColor.shadow=colorindexpicker
        //% bgColor.shadow=colorindexpicker
        //% bgImage.shadow=screen_image_picker
        export function createTextCounter(text: string, value: number, x?: number, y?: number, width?: number, height?: number, textColor?: number, outlineColor?: number, bgColor?: number, bgImage?: Image): Counter {
            return new Counter(text, value, { x, y, width, height, textColor, outlineColor, backgroundColor: bgColor, backgroundImage: bgImage });
        }

        /**
         * Creates a new counter with an image icon.
         */
        //% block="set $myCounter to image counter icon $icon value $value || at pos x $x y $y with size w $width h $height style color $textColor outline $outlineColor bg color $bgColor bg image $bgImage"
        //% group="Create"
        //% blockSetVariable=myCounter
        //% value.defl=0
        //% icon.shadow=screen_image_picker
        //% expandable=true
        //% inlineInputMode=inline
        //% textColor.shadow=colorindexpicker
        //% textColor.defl=1
        //% outlineColor.shadow=colorindexpicker
        //% bgColor.shadow=colorindexpicker
        //% bgImage.shadow=screen_image_picker
        export function createImageCounter(icon: Image, value: number, x?: number, y?: number, width?: number, height?: number, textColor?: number, outlineColor?: number, bgColor?: number, bgImage?: Image): Counter {
            return new Counter(icon, value, { x, y, width, height, textColor, outlineColor, backgroundColor: bgColor, backgroundImage: bgImage });
        }

        /**
         * Sets the value of a counter.
         */
        //% block="set $counter value to $value"
        //% counter.shadow=variables_get
        //% counter.defl=myCounter
        //% group="Update"
        export function setCounterValue(counter: Counter, value: number) {
            if (counter) {
                counter.setValue(value);
            }
        }

        /**
         * Changes the value of a counter by a given amount.
         */
        //% block="change $counter value by $amount"
        //% counter.shadow=variables_get
        //% counter.defl=myCounter
        //% group="Update"
        export function changeCounterValue(counter: Counter, amount: number) {
            if (counter) {
                counter.changeValueBy(amount);
            }
        }
    }
}
