const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;
class Sphere {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }
  contains(point) {
    const dx = point.x - this.center.x;
    const dy = point.y - this.center.y;
    const dz = point.z - this.center.z;
    return dx * dx + dy * dy + dz * dz <= this.radius * this.radius;
  }
} // Octree Node Class
class OctreeNode {
  constructor(center, size) {
    this.center = center;
    this.size = size;
    this.sphere = new Sphere(center, size / 2);
    this.children = [];
    this.points = [];
  }
  insert(point) {
    if (this.sphere.contains(point)) {
      if (this.points.length < 8) {
        this.points.push(point);
      } else {
        if (this.children.length === 0) {
          this.subdivide();
        }
        for (const child of this.children) {
          child.insert(point);
        }
      }
    }
  }
  subdivide() {
    const halfSize = this.size / 2;
    const offsets = [
      { x: -halfSize, y: -halfSize, z: -halfSize },
      { x: halfSize, y: -halfSize, z: -halfSize },
      { x: -halfSize, y: halfSize, z: -halfSize },
      { x: halfSize, y: halfSize, z: -halfSize },
      { x: -halfSize, y: -halfSize, z: halfSize },
      { x: halfSize, y: -halfSize, z: halfSize },
      { x: -halfSize, y: halfSize, z: halfSize },
      { x: halfSize, y: halfSize, z: halfSize },
    ];
    for (const offset of offsets) {
      const childCenter = new THREE.Vector3(
        this.center.x + offset.x,
        this.center.y + offset.y,
        this.center.z + offset.z
      );
      this.children.push(new OctreeNode(childCenter, halfSize));
    }
  }
} // Create an Octree and populate it with random points
const octree = new OctreeNode(new THREE.Vector3(0, 0, 0), 10);
const numPoints = 100;
for (let i = 0; i < numPoints; i++) {
  const point = new THREE.Vector3(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );
  octree.insert(point);
  const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.set(point.x, point.y, point.z);
  scene.add(sphereMesh);
} // Render loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
