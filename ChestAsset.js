/* =====================================================================
   ArtifactChest.js — drop-in three.js asset (single 1x1 + merged 2x1)
   texture: artifact_chest_atlas.png  (128x64, NEAREST filtering)
   usage:
     import { ArtifactChest } from './ChestAsset.js';
     const chest = new ArtifactChest(THREE, 'textures/artifact_chest_atlas.png');
     scene.add(chest.group);
     chest.setVariant('L');      // 'S' single | 'L' merged large
     chest.setOpen(0.0 .. 1.0);  // lid angle (0 closed, 1 open)
     chest.spin360();            // full 360 degree showcase rotation
   ===================================================================== */
export class ArtifactChest {
  constructor(THREE, atlasURL) {
    this.THREE = THREE; this.variant = 'S';
    this.ATW = 128; this.ATH = 64;
    this.REG = {
      S_LID_TOP:[0,0,14,14],  S_LID_FRONT:[14,0,14,5], S_LID_BACK:[28,0,14,5],
      S_LID_LEFT:[42,0,14,5], S_LID_RIGHT:[42,5,14,5], S_CLASP:[42,10,2,4],
      CLASP_SIDE:[44,10,2,4], CLASP_TOP:[46,10,2,1],   CLASP_BOT:[46,11,2,1],
      S_LID_BOT:[0,14,14,14], S_BODY_FRONT:[14,14,14,9], S_BODY_BACK:[28,14,14,9],
      S_BODY_LEFT:[42,14,14,9], S_BODY_RIGHT:[42,23,14,9], S_BODY_TOP:[14,23,14,9],
      S_BODY_BOT:[0,28,14,14],
      L_LID_TOP:[64,0,28,14],  L_LID_FRONT:[92,0,28,5],  L_LID_BACK:[92,5,28,5],
      L_BODY_FRONT:[64,14,28,9], L_BODY_BACK:[92,14,28,9],
      L_LID_BOT:[64,23,28,14], L_BODY_BOT:[92,23,28,14],
      L_INNER_LID:[64,37,14,5], L_INNER_BODY:[64,42,14,9], L_BODY_TOP:[78,37,14,9]
    };
    this.tex = (atlasURL && typeof atlasURL.isTexture !== 'undefined') ? atlasURL : new THREE.TextureLoader().load(atlasURL || 'textures/artifact_chest_atlas.png', (t) => {
      t.magFilter = THREE.NearestFilter;   // pixel-crisp, no blur
      t.minFilter = THREE.NearestFilter;
      t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true;
    });
    this.tex.magFilter = THREE.NearestFilter;
    this.tex.minFilter = THREE.NearestFilter;
    this.mat = new THREE.MeshLambertMaterial({ map: this.tex });
    this.group = new THREE.Group();
    this.pivots = []; this.clasps = [];
    this.single = this.buildSet(null);
    this.large  = new THREE.Group();
    const hL = this.buildSet('L'); hL.position.x = -7;
    const hR = this.buildSet('R'); hR.position.x =  7;
    this.large.add(hL, hR); this.large.visible = false;
    this.group.add(this.single, this.large);
    this._spin = 0; this._spinTarget = 0;
  }
  box(w, h, d, m) {
    const T = this.THREE, g = new T.BoxGeometry(w, h, d), uv = g.attributes.uv;
    ['px','nx','py','ny','pz','nz'].forEach((k, i) => {
      const r = typeof m[k] === 'string' ? this.REG[m[k]] : m[k];
      const u0 = r[0]/this.ATW, u1 = (r[0]+r[2])/this.ATW;
      const v0 = 1-(r[1]+r[3])/this.ATH, v1 = 1-r[1]/this.ATH;
      uv.setXY(i*4+0, u0, v1); uv.setXY(i*4+1, u1, v1);
      uv.setXY(i*4+2, u0, v0); uv.setXY(i*4+3, u1, v0);
    });
    uv.needsUpdate = true;
    return new T.Mesh(g, this.mat);
  }
  buildSet(half) {
    const S = !half, g = new this.THREE.Group();
    const body = this.box(14, 9, 14, S ?
      {px:'S_BODY_RIGHT',nx:'S_BODY_LEFT',py:'S_BODY_TOP',ny:'S_BODY_BOT',pz:'S_BODY_FRONT',nz:'S_BODY_BACK'} :
      half === 'L' ?
      {px:'L_INNER_BODY',nx:'S_BODY_LEFT',py:[78,37,14,9],ny:[92,23,14,14],pz:[64,14,14,9],nz:[92,14,14,9]} :
      {px:'S_BODY_RIGHT',nx:'L_INNER_BODY',py:[78,37,14,9],ny:[106,23,14,14],pz:[78,14,14,9],nz:[106,14,14,9]});
    body.position.y = 4.5; g.add(body);
    const piv = new this.THREE.Group(); piv.position.set(0, 9, -7); g.add(piv);
    this.pivots.push(piv);                       // hinge line y=9, z=-7
    const lid = this.box(14, 5, 14, S ?
      {px:'S_LID_RIGHT',nx:'S_LID_LEFT',py:'S_LID_TOP',ny:'S_LID_BOT',pz:'S_LID_FRONT',nz:'S_LID_BACK'} :
      half === 'L' ?
      {px:'L_INNER_LID',nx:'S_LID_LEFT',py:[64,0,14,14],ny:[64,23,14,14],pz:[92,0,14,5],nz:[92,5,14,5]} :
      {px:'S_LID_RIGHT',nx:'L_INNER_LID',py:[78,0,14,14],ny:[78,23,14,14],pz:[106,0,14,5],nz:[106,5,14,5]});
    lid.position.set(0, 2.5, 7); piv.add(lid);
    const cl = this.box(S ? 2 : 1, 4, 1, {       // split-UV clasp halves
      px:[44,10,1,4], nx:[44,10,1,4], py:[46,10,2,1], ny:[46,11,2,1],
      pz: S ? 'S_CLASP' : (half === 'L' ? [42,10,1,4] : [43,10,1,4]),
      nz:[44,10,1,4]});
    cl.position.set(S ? 0 : (half === 'L' ? 6.5 : -6.5), 9, 7.5);
    g.add(cl); this.clasps.push(cl);
    return g;
  }
  setVariant(v) { this.variant = v;
    this.single.visible = (v === 'S'); this.large.visible = (v === 'L'); }
  setOpen(t)  { this.pivots.forEach(p => { p.rotation.x = -1.9 * t; }); }  // -109 deg
  spin360()   { this._spinTarget += Math.PI * 2; }                          // full rotation
  tick(dt)    { // call every frame: smooth 360 spin
    this._spin += (this._spinTarget - this._spin) * Math.min(1, dt * 2.2);
    this.group.rotation.y = this._spin % (Math.PI * 2);
  }
  /* merge helper — call on place/break; neighbor = adjacent chest on X or null */
  applyMerge(neighbor) { this.setVariant(neighbor ? 'L' : 'S'); }
}
