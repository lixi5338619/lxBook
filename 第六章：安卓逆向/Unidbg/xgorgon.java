package com.douyin;
import com.github.unidbg.*;
import com.github.unidbg.linux.android.AndroidARMEmulator;
import com.github.unidbg.linux.android.AndroidEmulatorBuilder;
import com.github.unidbg.linux.android.AndroidResolver;
import com.github.unidbg.linux.android.dvm.*;
import com.github.unidbg.memory.Memory;
import com.github.unidbg.memory.MemoryBlock;
import com.github.unidbg.linux.android.dvm.array.ByteArray;
import java.io.File;
import java.io.IOException;

public class xgorgon extends AbstractJni {

    private static LibraryResolver createLibraryResolver() {
        return new AndroidResolver(23);
    }

    private static AndroidEmulator createARMEmulator() {
        AndroidEmulator emulator = AndroidEmulatorBuilder.for32Bit().build();
        return emulator;
    }

    private final AndroidEmulator emulator;
    private final VM vm;
    private final DvmClass Native;

    private xgorgon() {
        emulator = createARMEmulator();
        final Memory memory = emulator.getMemory(); memory.setLibraryResolver(createLibraryResolver());

        vm = emulator.createDalvikVM(new File("com.sun.jna"));
        vm.setJni(this);
        vm.setVerbose(true); // 自行修改文件路径
        DalvikModule dm = vm.loadLibrary(new File("C:\\Users\\feiyi\\Desktop\\unidbg-master\\unidbg-android\\src\\test\\java\\com\\douyin\\libcms.so"), false);
        dm.callJNI_OnLoad(emulator);

        Native = vm.resolveClass("com/ss/sys/ces/a");
    }
    private void destroy() throws IOException {
        emulator.close();
        System.out.println("destroy"); }
    public static void main(String[] args) throws Exception {
        xgorgon test = new xgorgon();
        test.test();
        test.destroy();
    }

    public static String xuzi1(byte[] bArr) {
        if (bArr == null) {
            return null;
        }
        char[] charArray = "0123456789abcdef".toCharArray();
        char[] cArr = new char[(bArr.length * 2)];
        for (int i = 0; i < bArr.length; i++) {
            int b2 = bArr[i] & 255;
            int i2 = i * 2;
            cArr[i2] = charArray[b2 >>> 4];
            cArr[i2 + 1] = charArray[b2 & 15];
        }
        return new String(cArr); }

    private void test() {
        String methodSign = "leviathan(II[B)[B";
        byte[] data = "这里是url经过处理后的data".getBytes();
        int time = (int) (System.currentTimeMillis() / 1000);

        Native.callStaticJniMethod(emulator, methodSign, -1,time,new ByteArray(vm,data));

        Object ret = Native.callStaticJniMethodObject(emulator, methodSign, -1,time,new ByteArray(vm,data));

        System.out.println("callObject执行结果:"+((DvmObject) ret).getValue());
        byte[] tt = (byte[]) ((DvmObject) ret).getValue();
        System.out.println(new String(tt));
        String s = xuzi1(tt); System.out.println(s);
    }
}