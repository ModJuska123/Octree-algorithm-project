import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(25, 10, 15);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 10;

class Sphere {
  constructor(center, radius, color) {
    this.center = center;
    this.radius = radius;
    this.color = color;
  }

  contains(point) {
    const dx = point.x - this.center.x;
    const dy = point.y - this.center.y;
    const dz = point.z - this.center.z;
    return dx * dx + dy * dy + dz * dz <= this.radius * this.radius;
  }
}

class OctreeNode {
  constructor(center, size) {
    this.center = center;
    this.size = size;
    this.sphere = new Sphere(center, size / 2, 0x00ff00);
    this.children = [];
    this.points = [];

    this.createSphere(center);
  }

  createSphere(position) {
    const color = Math.floor(Math.random() * 16777215);
    const sphereGeometry = new THREE.SphereGeometry(this.size / 10, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.position.set(position.x, position.y, position.z);
    scene.add(sphereMesh);

    this.points.push({
      position: { x: position.x, y: position.y, z: position.z },
      color: color,
    });
  }

  insert(point) {
    if (this.sphere.contains(point)) {
      if (this.points.length < 8) {
        this.points.push({
          position: { x: point.x, y: point.y, z: point.z },
          color: Math.floor(Math.random() * 16777215), // Assign a random color
        });
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
      const childNode = new OctreeNode(childCenter, halfSize);
      this.children.push(childNode);
    }
  }
}

const octree = new OctreeNode(new THREE.Vector3(0, 0, 0), 10);

const numPoints = 100;
for (let i = 0; i < numPoints; i++) {
  const point = new THREE.Vector3(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );
  octree.insert(point);
}

function encodeLASHeader(numPoints) {
  const header = new Uint8Array(227);
  header.set([76, 65, 83, 70]);
  header[24] = 1;
  header[25] = 2;
  header[105] = 28; 
  new DataView(header.buffer).setUint32(107, numPoints, true);
  return header;
}

function encodePointsLAS(points) {
  const buffer = new ArrayBuffer(points.length * 28);
  const view = new DataView(buffer);

  points.forEach((point, i) => {
    const factor = 100; 
    const x = Math.round(point.position.x * factor);
    const y = Math.round(point.position.y * factor);
    const z = Math.round(point.position.z * factor);

    view.setInt32(i * 28, x, true);
    view.setInt32(i * 28 + 4, y, true);
    view.setInt32(i * 28 + 8, z, true);

    view.setUint16(i * 28 + 20, (point.color >> 16) & 0xff, true); // R
    view.setUint16(i * 28 + 22, (point.color >> 8) & 0xff, true); // G
    view.setUint16(i * 28 + 24, point.color & 0xff, true); // B
  });
  return buffer;
}

function saveLASFile(points) {
  const header = encodeLASHeader(points.length);
  const pointData = encodePointsLAS(points);

  const blob = new Blob([header, pointData], {
    type: "application/octet-stream",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "spheres.las";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

saveLASFile(octree.points);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();