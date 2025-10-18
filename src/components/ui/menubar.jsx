import React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";

const MenubarDemo = () => {
  return (
    <div className="p-10">
      <MenubarPrimitive.Root>
        <MenubarPrimitive.Menu>
          <MenubarPrimitive.Trigger>File</MenubarPrimitive.Trigger>
          <MenubarPrimitive.Content>
            <MenubarPrimitive.Item>New File <span className="ml-auto text-xs">⌘N</span></MenubarPrimitive.Item>
            <MenubarPrimitive.Item>Open File <span className="ml-auto text-xs">⌘O</span></MenubarPrimitive.Item>
            <MenubarPrimitive.Separator />
            <div className="px-2 py-1 text-xs font-semibold">Recent Files</div>
            <MenubarPrimitive.Item>file1.txt</MenubarPrimitive.Item>
            <MenubarPrimitive.Item>file2.txt</MenubarPrimitive.Item>
          </MenubarPrimitive.Content>
        </MenubarPrimitive.Menu>

        <MenubarPrimitive.Menu>
          <MenubarPrimitive.Trigger>Edit</MenubarPrimitive.Trigger>
          <MenubarPrimitive.Content>
            <MenubarPrimitive.Item>Undo <span className="ml-auto text-xs">⌘Z</span></MenubarPrimitive.Item>
            <MenubarPrimitive.Item>Redo <span className="ml-auto text-xs">⇧⌘Z</span></MenubarPrimitive.Item>
          </MenubarPrimitive.Content>
        </MenubarPrimitive.Menu>

        <MenubarPrimitive.Menu>
          <MenubarPrimitive.Trigger>View</MenubarPrimitive.Trigger>
          <MenubarPrimitive.Content>
            <MenubarPrimitive.Item>Zoom In <span className="ml-auto text-xs">⌘+</span></MenubarPrimitive.Item>
            <MenubarPrimitive.Item>Zoom Out <span className="ml-auto text-xs">⌘-</span></MenubarPrimitive.Item>
          </MenubarPrimitive.Content>
        </MenubarPrimitive.Menu>
      </MenubarPrimitive.Root>
    </div>
  );
};

export default MenubarDemo;
